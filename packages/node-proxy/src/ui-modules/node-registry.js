import logger from '../utils/logger.js';

class NodeRegistry {
    constructor() {
        this.nodes = new Map();
        this.heartbeatTimeout = 30000;
        this.cleanupInterval = null;
        this.startCleanup();
    }

    startCleanup() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupDeadNodes();
        }, this.heartbeatTimeout);
    }

    stopCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    cleanupDeadNodes() {
        const now = Date.now();
        for (const [nodeId, node] of this.nodes.entries()) {
            if (now - node.lastHeartbeat > this.heartbeatTimeout * 2) {
                logger.warn(`[NodeRegistry] Removing dead node: ${nodeId}`);
                this.nodes.delete(nodeId);
            }
        }
    }

    registerNode(nodeId, nodeInfo) {
        const existingNode = this.nodes.get(nodeId);
        const now = Date.now();

        const node = {
            nodeId,
            name: nodeInfo.name || `Node-${nodeId.slice(0, 8)}`,
            host: nodeInfo.host || 'unknown',
            port: nodeInfo.port || 3000,
            pid: nodeInfo.pid,
            nodeVersion: nodeInfo.nodeVersion,
            platform: nodeInfo.platform,
            mode: nodeInfo.mode,
            status: 'online',
            registeredAt: existingNode?.registeredAt || now,
            lastHeartbeat: now,
            cpu: existingNode?.cpu || 0,
            memory: existingNode?.memory || 0,
            gpu: existingNode?.gpu || null,
            uptime: nodeInfo.uptime || 0
        };

        this.nodes.set(nodeId, node);
        logger.info(`[NodeRegistry] Node registered: ${nodeId}, total nodes: ${this.nodes.size}`);
        return node;
    }

    updateHeartbeat(nodeId, metrics = {}) {
        const node = this.nodes.get(nodeId);
        if (!node) {
            return null;
        }

        node.lastHeartbeat = Date.now();
        node.status = 'online';

        if (metrics.cpu !== undefined) node.cpu = metrics.cpu;
        if (metrics.memory !== undefined) node.memory = metrics.memory;
        if (metrics.gpu !== undefined) node.gpu = metrics.gpu;
        if (metrics.uptime !== undefined) node.uptime = metrics.uptime;

        return node;
    }

    removeNode(nodeId) {
        const result = this.nodes.delete(nodeId);
        if (result) {
            logger.info(`[NodeRegistry] Node removed: ${nodeId}, remaining: ${this.nodes.size}`);
        }
        return result;
    }

    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    getAllNodes() {
        return Array.from(this.nodes.values()).map(node => ({ ...node }));
    }

    getOnlineNodes() {
        return Array.from(this.nodes.values())
            .filter(node => node.status === 'online')
            .map(node => ({ ...node }));
    }

    getAggregatedMetrics() {
        const nodes = this.getOnlineNodes();
        if (nodes.length === 0) {
            return {
                totalNodes: 0,
                onlineNodes: 0,
                avgCpu: 0,
                maxCpu: 0,
                avgMemory: 0,
                maxMemory: 0,
                hasGpu: false,
                nodes: []
            };
        }

        const cpuValues = nodes.map(n => n.cpu).filter(v => v > 0);
        const memValues = nodes.map(n => n.memory).filter(v => v > 0);
        const hasGpu = nodes.some(n => n.gpu !== null);

        return {
            totalNodes: this.nodes.size,
            onlineNodes: nodes.length,
            avgCpu: cpuValues.length > 0 ? cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length : 0,
            maxCpu: cpuValues.length > 0 ? Math.max(...cpuValues) : 0,
            avgMemory: memValues.length > 0 ? memValues.reduce((a, b) => a + b, 0) / memValues.length : 0,
            maxMemory: memValues.length > 0 ? Math.max(...memValues) : 0,
            hasGpu,
            nodes: nodes.map(node => ({
                nodeId: node.nodeId,
                name: node.name,
                host: node.host,
                cpu: node.cpu,
                memory: node.memory,
                gpu: node.gpu,
                status: node.status,
                uptime: node.uptime
            }))
        };
    }

    getNodeCount() {
        return this.nodes.size;
    }

    isNodeRegistered(nodeId) {
        return this.nodes.has(nodeId);
    }
}

const nodeRegistry = new NodeRegistry();

export default nodeRegistry;
export { NodeRegistry };
