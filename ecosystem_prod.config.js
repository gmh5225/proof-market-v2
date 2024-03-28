module.exports = {
    apps : [{
        name: 'Proof Market Production',
        script: 'ts-node',
        args: 'src/main.ts',
        watch: false,
        ignore_watch : ["node_modules", "dist"],
    }]
};