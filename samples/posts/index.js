const feathers = require("feathers");
const app = feathers();
const NextQL = require("../../../nextql/src");
const nextql = new NextQL();
const models = require("./models");
nextql.use(require("../../src"), { app: app });
Object.keys(models).forEach(k => nextql.model(k, models[k]));

async function test(){
    await app.service('users').create([
        { _id: '2000', name: 'John' },
        { _id: '2001', name: 'Marshall' },
        { _id: '2002', name: 'David' },
    ]).catch(() => true); //bypass if already created

    await app.service('posts').create([
        { _id: '100', message: 'Hello', posterId: '2000', readerIds: ['2001', '2002'] }
    ]).catch(() => true); //bypass if already created

    const post = await app.service('posts').get('100',{
        query: {
            _id: 1,
            message: 1,
            poster: {
                name: 1,
                posts: {
                    message: 1
                }
            },
            readers: {
                name: 1
            }
        }
    });
    console.log(post);
}

test().then(() => true, console.log);

