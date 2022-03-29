import Publisher from "../Models/publisher.js";
import Book from "../Models/book.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function seedPublisher() {
    /* let results = await axios(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${process.env.API_KEY}`);

    for (let i = 0; i < 2; i++) {
        results.data.results.lists[i].books.forEach(book => {
            Publisher.findOne({name: book.publisher}, (err, docs)=>{
                console.log(docs);
                if (!docs){
                    Publisher.create({
                        name: book.publisher,
                        foundationYear: Math.floor(Math.random()*(2011-1950)+1950)
                    });
                }
            })
        });
    } */
    let books = await Book.find(); //Hay 180 libros y 30 autores
    books=books.map(book=>book._id);
    let publishers = await Publisher.find();
    let cont = 0;
    for (let i = 0; i < publishers.length; i++) {
        let booksOfPublisher = books.slice(cont,cont+9);
        let publisher1 = await actualizar(publishers[i], booksOfPublisher);
        cont+=9;
    }
    // console.log("Editoriales cargadas");
}
const actualizar= async(publisher, books)=>{
    return await Publisher.findByIdAndUpdate({_id: publisher._id},{books});
}