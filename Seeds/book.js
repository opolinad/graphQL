import Book from "../Models/book.js";
import Author from "../Models/author.js";
import Publisher from "../Models/publisher.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function seedBook() {
    /* let results = await axios(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${process.env.API_KEY}`);
    let genres = ["Misterio", "Drama", "Romance", "Ciencia ficción", "Policiaco", "Erótico", "Acción y aventura", "Clásico", "Novela gráfica", "Fantasía"]
    let cont = 0;
    for (let i = 0; i < 18; i++) {
        results.data.results.lists[i].books.forEach(async (book) => {
            Book.findOne({ title: book.title }, async (err, docs) => {
                (book.primary_isbn10 === "None" || book.primary_isbn10 === "") && cont++;
                let isbn = (book.primary_isbn10 !== "None" && book.primary_isbn10 !== "") ? book.primary_isbn10 : (cont < 10 ? "000000000" + cont.toString() : "00000000" + cont.toString());
                if (!docs) {
                    Book.create({
                        title: book.title,
                        ISBN: isbn,
                        synopsis: book.description || "Esta es una sinopsis del libro",
                        genre: genres[Math.floor(Math.random() * 10)],
                        publicationYear: Math.floor(Math.random() * (2023 - 2000) + 2000)
                    }, (err, small) => {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
            })
        })
    }; */
    let books = await Book.find();
    let authors = await Author.find();
    authors=authors.map(author=>author._id);
    let publishers = await Publisher.find();
    publishers=publishers.map(publisher=>publisher._id);
    for (let i = 0; i < books.length; i++) {
        let author = await Author.findOne({books: books[i]._id});
        let publisher = await Publisher.findOne({books: books[i]._id});
        await Book.findByIdAndUpdate(books[i]._id, {author, publisher})
    }

}
