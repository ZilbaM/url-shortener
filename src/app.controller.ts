import { Controller, Get, Param, Post, Req, HttpRedirectResponse, HttpException, HttpStatus, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';


export interface UrlRequest extends Request  {
  ReqBody: {
    url: string
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async urlShorten(@Req() request: UrlRequest): Promise<String> {
    const originalUrl = request.body.url
    const shortenedUrl = await this.appService.shortenUrl(originalUrl)
    const completePath = `${request.protocol}://${request.get('host')}/${shortenedUrl}`
    return completePath
  }

  @SkipThrottle()
  @Get(':shortUrl')
  async getRedirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.appService.findOriginalUrl(shortUrl)
    if (originalUrl) {
      return res.redirect(originalUrl)
    } else {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND)
    }
  }
}
