module.exports = {
  apps: [{
    name: 'studios',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    
    env: {
      NODE_ENV: 'production',
      PORT: 3000  // Different port from narcoa47 (3001)
    },
    
    max_memory_restart: '1G',
    error_file: './logs/next-error.log',
    out_file: './logs/next-out.log',
    time: true,
    merge_logs: true,
    
    watch: false,
    autorestart: true,
    kill_timeout: 5000,
    listen_timeout: 3000
  }]
};
