import { ApolloServer, UserInputError, gql, AuthenticationError } from "apollo-server";
import { dbConnect } from "./db.js";
import { seedAutor } from "./Seeds/author.js"
import { seedBook } from "./Seeds/book.js"
import { seedPublisher } from "./Seeds/publisher.js"
import bookModel from "./Models/book.js";
import authorModel from "./Models/author.js";
import publisherModel from "./Models/publisher.js";
import userModel from "./Models/user.js"
import jwt from "jsonwebtoken"
import DataLoader from "dataloader";
const JWT_SECRET = "Maestrik"

const typeDefs = gql`
enum orderEnum{
    title_asc,
    title_des,
    year_asc,
    year_desc
}
type Book {
    id: String!,
    title: String!,
    ISBN: String!,
    synopsis: String!,
    genre: String!,
    publicationYear: Int!,
    author: Author,
    publisher: Publisher
}
type Author{
    id:String!,
    firstName:String!,
    lastName:String!,
    country:String!,
    books:[Book]
}
type Publisher{
    id:String!,
    name:String!,
    foundationYear:Int!
    books:[Book]
}
type Token{
    value:String!
}
type User{
    id: String!,
    username: String!,
    password:String!
}
type Query{
    allBooks(page:Int, title:String, publisher: String, author:String, publicationYear:Int, order:orderEnum): [Book]!,
    allAuthors: [Author]!,
    allPublishers: [Publisher]!,
    bookId(bookId:String!): Book!,
    authorId(authorId:String!): Author!,
    publisherId(publisherId:String!): Publisher!,
    me:User
}
type Mutation{
    addBook(
        title: String!,
        ISBN: String!,
        synopsis: String!,
        genre: String!,
        publicationYear: Int!
    ):Book ,
    modifyBook(
        title: String,
        ISBN: String,
        synopsis: String,
        genre: String,
        publicationYear: Int
    ):Book,
    createUser(
        username:String!,
        password: String!
    ):User,
    login(
        username:String!,
        password: String!
    ):Token
}
`

const resolvers = {
    Query: {
        allBooks: async (root, { page, title, publisher, author, publicationYear, order }) => {
            let booksPerPage = 20;
            let pageNum = page ? page : 1;
            let arr = await bookModel.find().populate("author").populate("publisher");
            author && (arr = arr.filter(book => `${book.author.firstName} ${book.author.lastName}` === author));
            publisher && (arr = arr.filter(book => book.publisher.name === publisher));
            title && (arr = arr.filter(book => book.title === title));
            publicationYear && (arr = arr.filter(book => book.publicationYear === publicationYear));
            order && (order === "title_asc" && arr.sort((a, b) => {
                if (a.title > b.title) return 1;
                else if (a.title < b.title) return -1;
            }));
            order && (order === "title_des" && arr.sort((a, b) => {
                if (a.title < b.title) return 1;
                else if (a.title > b.title) return -1;
            }));
            order && (order === "year_asc" && arr.sort((a, b) => {
                if (a.publicationYear > b.publicationYear) return 1;
                else if (a.publicationYear < b.publicationYear) return -1;
            }));
            order && (order === "year_desc" && arr.sort((a, b) => {
                if (a.publicationYear < b.publicationYear) return 1;
                else if (a.publicationYear > b.publicationYear) return -1;
            }));
            return arr.slice((pageNum - 1) * booksPerPage, (pageNum - 1) * booksPerPage + booksPerPage)
        },
        allAuthors: async (root, args, context) => {
            if (!context.username) throw new AuthenticationError("Debe loguear para acceder a esta información");
            return await authorModel.find().populate("books");
        },
        allPublishers: async () => await publisherModel.find().populate("books"),
        bookId: async (root, { bookId }) => await bookModel.findById(bookId),
        authorId: async (root, { authorId }, context) => {
            if (!context.username) throw new AuthenticationError("Debe loguear para acceder a esta información");
            return await authorModel.findById(authorId).populate("books");
        },
        publisherId: async (root, { publisherId }) => await publisherModel.findById(publisherId).populate("books"),
        me: (root, args, context) => context
    },
    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.username) throw new AuthenticationError("Debe loguear para crear un nuevo libro");
            const newBook = { ...args };
            bookModel.find({ title: args.title }, async (err, docs) => {
                console.log("Entra");
                if (!docs) {
                    await bookModel.create(newBook);
                }
            })
            return newBook;
        },
        modifyBook: async (root, args, context) => {
            if (!context.username) throw new AuthenticationError("Debe loguear para modificar la información");
            const book = await bookModel.find({ ISBN: args.ISBN });
            // if (!book.length) return null;
            bookModel.update({ ISBN: args.ISBN }, args);
            return ({ ...(book[0]._doc), ...args });
        },
        createUser: async (root, args) => {
            await userModel.create(args);
            return args;
        },
        login: async (root, args) => {
            const { username, password } = args;
            const user = await userModel.findOne({ username, password });
            if (!user) throw new UserInputError("Datos de inicio no válidos");
            return { value: jwt.sign({ ...user }, JWT_SECRET) }

        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth?.toLocaleLowerCase().startsWith("bearer ")) {
            const decodedToken = jwt.verify(auth.slice(7), JWT_SECRET);
            const validUser = await userModel.findOne({ username: decodedToken._doc.username })
            return validUser;
        }
    }
});

server.listen().then(async ({ url }) => {
    await dbConnect();
    // await seedAutor();
    // await seedBook();
    // await seedPublisher();
    console.log(`Server ready at ${url}`);
})