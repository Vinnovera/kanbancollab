var restler = require('restler');

var kanbanToken = '438584b966aa9464ee042786a618819b',
    collabToken = '1-V7xW9NX2ALW1K5dClrOHyN3BrK8EoY20UoVR2IHq';

var key = new Buffer('apiToken:' + kanbanToken);

restler.get(
    'https://kanbanflow.com/api/v1/tasks',
    {
        headers: {
            'Accept':           'application/json',
            'Authorization':    'Basic ' + key.toString('base64')
        }
    }
).on('success', function(data) {
    for (var x in data) {
        var column = data[x];

        for (var y in column.tasks) {
            var task = column.tasks[y];

            restler.post(
                'http://collab.vinnovera.se/public/api.php',
                {
                    query: {
                        'path_info':        'projects/kanbanflow/tasks/add',
                        'auth_api_token':   collabToken
                    },
                    data: {
                        'task[name]':       task.name,
                        'task[body]':       task.description,
                        'submitted':        'submitted'
                    },
                    headers: {
                        'Accept':           'application/json'
                    }
                }
            ).on('complete', function(data) {
                    console.log(data);
                console.log('Added ' + task.name);
            });
        }
    }
});
