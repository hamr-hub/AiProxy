import nodeRegistry from './node-registry.js';
import { getCpuUsagePercent } from './system-monitor.js';
import os from 'os';
import crypto from 'crypto';

function generateNodeId() {
    return crypto.randomBytes(16).toString('hex');
}

function getLocalNodeId() {
    if (!global.localNodeId) {
        const hostname = os.hostname();
        const pid = process.pid;
        global.localNodeId = `${hostname}-${pid}-${generateNodeId().slice(0, 8)}`;
    }
    return global.localNodeId;
}

export async function handleNodeRegister(req, res) {
    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString());

        const nodeId = getLocalNodeId();
        const nodeInfo = {
            name: body.name || `Node-${process.pid}`,
            host: body.host || os.hostname(),
            port: body.port || 3000,
            pid: process.pid,
            nodeVersion: process.version,
            platform: process.platform,
            mode: process.env.IS_WORKER_PROCESS === 'true' ? 'worker' : 'standalone',
            uptime: process.uptime()
        };

        const registeredNode = nodeRegistry.registerNode(nodeId, nodeInfo);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            nodeId: nodeId,
            node: registeredNode
        }));
        return true;
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
        return true;
    }
}

export async function handleNodeHeartbeat(req, res) {
    try {
        const nodeId = getLocalNodeId();
        const total = os.totalmem();
        const free = os.freemem();
        const memoryUsage = ((total - free) / total * 100);

        const metrics = {
            cpu: parseFloat(getCpuUsagePercent()),
            memory: parseFloat(memoryUsage.toFixed(1)),
            uptime: process.uptime()
        };

        const updatedNode = nodeRegistry.updateHeartbeat(nodeId, metrics);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            nodeId: nodeId,
            metrics: metrics,
            timestamp: Date.now()
        }));
        return true;
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
        return true;
    }
}

export async function handleGetNodes(req, res) {
    const nodes = nodeRegistry.getAllNodes();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: true,
        nodes: nodes,
        total: nodes.length
    }));
    return true;
}

export async function handleGetAggregatedMonitor(req, res) {
    const nodeId = getLocalNodeId();
    const node = nodeRegistry.getNode(nodeId);

    if (!node) {
        const total = os.totalmem();
        const free = os.freemem();
        const memoryUsage = ((total - free) / total * 100);

        nodeRegistry.registerNode(nodeId, {
            name: `Node-${process.pid}`,
            host: os.hostname(),
            port: process.env.API_PORT || 3000,
            pid: process.pid,
            nodeVersion: process.version,
            platform: process.platform,
            mode: process.env.IS_WORKER_PROCESS === 'true' ? 'worker' : 'standalone',
            uptime: process.uptime()
        });
    }

    nodeRegistry.updateHeartbeat(nodeId, {
        cpu: parseFloat(getCpuUsagePercent()),
        memory: parseFloat(((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1)),
        uptime: process.uptime()
    });

    const aggregated = nodeRegistry.getAggregatedMetrics();

    const total = os.totalmem();
    const free = os.freemem();

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const localData = {
        nodeId: nodeId,
        name: `Node-${process.pid}`,
        host: os.hostname(),
        cpu: parseFloat(getCpuUsagePercent()),
        cpuHistory: null,
        memory: {
            total: formatBytes(total),
            used: formatBytes(total - free),
            free: formatBytes(free),
            usagePercent: parseFloat(((total - free) / total * 100).toFixed(1))
        },
        memoryHistory: null,
        platform: process.platform,
        pid: process.pid,
        uptime: process.uptime()
    };

    if (aggregated.nodes.length <= 1) {
        aggregated.nodes = [localData];
        aggregated.totalNodes = 1;
        aggregated.onlineNodes = 1;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: true,
        aggregated: aggregated,
        local: localData,
        timestamp: Date.now()
    }));
    return true;
}

export async function handleUnregisterNode(req, res) {
    try {
        const nodeId = getLocalNodeId();
        nodeRegistry.removeNode(nodeId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            nodeId: nodeId
        }));
        return true;
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
        return true;
    }
}

export { getLocalNodeId, nodeRegistry };
