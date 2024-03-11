import { createServer } from "miragejs"
import * as data from '../data/data.json' with { type: "json" };

export const makeServer = () => {
    
createServer({
        routes() {
            this.get("/api/messages", (schema, request) => {
                return schema.db.messages
            }),
            this.patch("/api/messages/:id", (schema, request) => {
                let id = request.params.id
                let attrs = JSON.parse(request.requestBody)
                console.log(attrs);
                return schema.db.messages.update(id, attrs)
            })
        },
        seeds(server) {
            server.db.loadData({
                messages: data.default
            })
        }
    })
}
