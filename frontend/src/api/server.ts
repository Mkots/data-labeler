import { createServer } from "miragejs"
import data from '../data/data.json' with { type: "json" };

export const makeServer = () => {
    
createServer({
        routes() {
            this.get("/api/message", (schema) => {
                console.log(schema.db.messages.where({reviewed: undefined})[0]);
                
                return schema.db.messages.where({reviewed: undefined})[0]
            }),
            this.put("/api/message/", (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                const id = attrs.new.id
                const message = attrs.new
                return schema.db.messages.update(id, message)
            })
        },
        seeds(server) {
            server.db.loadData({
                messages: data
            })
        }
    })
}
