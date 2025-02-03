import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, ObjectId } from 'mongoose';

export type urlDocument = HydratedDocument<Url>;

@Schema()
export class Url extends Document {
  _id: ObjectId;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, sparse: true })
  shortUrl?: string;

  @Prop({default: 0})
  visitCount: number

  @Prop({ default: Date.now, immutable: true })
  createdAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
