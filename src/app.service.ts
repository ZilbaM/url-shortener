import { Injectable } from '@nestjs/common';
import { Url } from './app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { base62 } from './utils/base62';

interface RedirectResponse {
  url: string
}


@Injectable()
export class AppService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  async shortenUrl(originalUrl : string) : Promise<string> {
      // 1. Insert the original URL into the database to get the index
      const createdUrl = new this.urlModel({ originalUrl });
      const savedUrl = await createdUrl.save();

      // 2. Create a short URL 
      const base62Id = base62.encode(savedUrl._id.toString());

      // 3. Update the database with the short URL
      savedUrl.shortUrl = base62Id
      await savedUrl.save()

      // 4. Return the short URL
      return base62Id
  }

  async findOriginalUrl(shortUrl: string): Promise<string | null> {
    const id = base62.decode(shortUrl)

    const foundUrl = await this.urlModel.findById(id).exec()
    if (foundUrl){
      foundUrl.visitCount += 1
      foundUrl.save()
      return foundUrl.originalUrl
    } else {
      return null
    }
  }
}
