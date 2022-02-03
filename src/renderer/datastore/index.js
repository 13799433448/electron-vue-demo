import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const db = {}
db.keywords = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/keywords.db')
});
db.history = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/history.db')
});

export default db