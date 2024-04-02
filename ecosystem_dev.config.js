module.exports = {
    apps : [{
        name: 'Proof Market Development',
        script: 'ts-node',
        args: 'src/main.ts',
        watch: true,
        ignore_watch : ["node_modules", "dist"],
    }]
};