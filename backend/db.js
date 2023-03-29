import { ConnectionPoolClearedEvent, MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';
const MONGO_DB = process.env.MONGO_DB || 'todos';

let db = null;
let collection = null;
export default class DB {
    connect() {
        return MongoClient.connect(MONGO_URI)
            .then(function (client) {
                db = client.db(MONGO_DB);
                collection = db.collection('todos');
            })
    }

    queryAll() {
        return collection.find().toArray();
    }

    async queryById(id) {
        const querry = {'_id': new ObjectId(id)};
        let todo = await collection.findOne(querry);
        return todo;
    }


    async update(id, order) {
        const querry = {'_id': new ObjectId(id)};
        let newValues = { $set: {title: order.title, due: order.due, status: order.status } }; 
        await collection.updateOne(querry, newValues);
    }

    async delete(id) {
        const querry = {'_id': new ObjectId(id)};
        await collection.deleteOne(querry);
    }

    insert(order) {
        order._id = new ObjectId();
        collection.insertOne(order);
    }

}
