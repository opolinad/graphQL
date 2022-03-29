import Author from "../Models/author.js";
import Book from "../Models/book.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function seedAutor() {
    /* let results = await axios(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${process.env.API_KEY}`);
    let countries = ["Colombia", "Estados Unidos", "Reino Unido", "Israel", "Argentina", "Perú", "Brazil", "Canadá", "Chile", "México"];
    for (let i = 0; i < 2; i++) {
        results.data.results.lists[i].books.forEach(book => {
            Author.findOne({firstName: book.author.split(" ")[0],lastName: book.author.split(" ")[1]}, (err, docs)=>{
                if (!docs){
                    Author.create({
                        firstName: book.author.split(" ")[0],
                        lastName: book.author.split(" ")[1] || "Smith",
                        country: countries[Math.floor(Math.random()*10)]
                    });
                }
            })
        });
    } */
    let books = await Book.find(); //Hay 180 libros y 30 autores
    books=books.map(book=>book._id);
    let authors = await Author.find();
    let cont = 0;
    for (let i = 0; i < authors.length; i++) {
        let booksOfAuthor = books.slice(cont,cont+6);
        let author1 = await actualizar(authors[i], booksOfAuthor);
        cont+=6;
    }

}
const actualizar= async(autor, books)=>{
    return await Author.findByIdAndUpdate({_id: autor._id},{books});
}