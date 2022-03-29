import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
 const bookSchema = new mongoose.Schema({
    title: {type: String, required:true, unique:true},
    ISBN: {type: String, required:true, unique:true},
    synopsis: {type:String, required:true},
    genre: {type:String, required:true},
    publicationYear: {type:Number, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:"authors"},
    publisher:{type:mongoose.Schema.Types.ObjectId, ref:"publishers"}
 });
bookSchema.plugin(uniqueValidator);
 export default mongoose.model ("books", bookSchema)