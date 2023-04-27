import express, { Request, Response} from 'express';
import cors from 'cors';
import { TVideoDB } from './types';
import { db } from './database/knex';
import { Video } from './models/Video';
import { title} from 'process';



const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Tudo funcionando! Servidor rodando na porta 3003");
});

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req:Request, res:Response)=>{
    try {
        const q = req.query.q 
        let videosDB

        if(q){

            const result: TVideoDB[] = await db ("videos").where("title", "%LIKE", `%{q}%`)
            videosDB = result
        } else {
            const result: TVideoDB[] = await db("videos")
            videosDB = result
        }

        const videos: Video[] = videosDB.map((videoDB)=> new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date

        ))
            res.status(200).send(videos)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration, upload_date} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'Título' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser número")
        }

        if (typeof upload_date !== "string") {
            res.status(400)
            throw new Error("'data do upload' deve ser string")
        }

        const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id })

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        //instanciando 
        const newVideo = new Video(
            id, 
            title,
            duration, 
            new Date().toISOString()
        )
        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_date: newVideo.getUploadDate()
        }
        await db("videos").insert(newVideoDB)
        const [ videoDB ]: TVideoDB[] = await db("videos").where({ id })
        res.status(200).send(newVideoDB)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//implemente os endpoints put e delete

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { title, duration } = req.body;
  
      if (!id) {
        res.status(400);
        throw new Error("'id' deve ser informado");
      }
  
      if (!title || typeof title !== "string") {
        res.status(400);
        throw new Error("'title' deve ser uma string");
      }
  
      if (!duration || typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' deve ser um número");
      }
  
      const videoDB = await db("videos")
        .where({ id })
        .first<TVideoDB>();
  
      if (!videoDB) {
        res.status(404);
        throw new Error("'id' não encontrado");
      }
  
      await db("videos").update({ title, duration }).where({ id });

      //instancia da classe

      const video = new Video(
        id, 
        title, 
        duration,
        videoDB.upload_date
      )
      res.status(200).send(video)
    } catch (error) {
        console.log(error);
    
        if (res.statusCode === 200) {
          res.status(500);
        }
    
        if (error instanceof Error) {
          res.send(error.message);
        } else {
          res.send("Erro inesperado");
        }
      }
    });


                    //ENDPOINT DELETE


app.delete("/videos/:id", async(req: Request, res:Response)=>{
try {
            const id = req.params.id
            
const videoDB: TVideoDB | undefined = await db("videos").where({id}).first();

if (!videoDB){
    res.status(400)
    throw new Error("Vídeo não encontrado")
}
const video = new Video(videoDB.id, videoDB.title, videoDB.duration, videoDB.upload_date)
await db("videos").delete().where({id});

res.status(200).send("Vídeo deletado com sucesso!")
} catch (error) {
    console.log(error);
  
    if (res.statusCode === 200) {
      res.status(500);
    }
  
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Unexpected error.");
    }
  }
  
        }
    )