import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  main_cat_name: string;

  @Prop()
  uniqueId?:string;
  @Prop()
  liveUrl?:string;

  @Prop()
  metaTitle?: string;

  @Prop()
  metaKeyword?: string;

  @Prop()
  metaDescription?: string;

 @Prop()
  imageUrl?: string;
  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  mappedChildren?: Types.ObjectId[];


  //   @Prop()
  // description?: string;

  // // ✅ NEW FIELD: List of product names (strings)
  // @Prop({ type: [String], default: [] })
  // products?: string[];

   @Prop()
  paragraph: string;

  // Use an array of objects to store the link text and its corresponding URL.
  @Prop([
    {
      text: String,
      url: String, // Assuming each link has a URL.
    },
  ])
  links: {
    text: string;
    url: string;
  }[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
