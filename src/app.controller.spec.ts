import { Test, TestingModule } from '@nestjs/testing';
import { AppController, UrlRequest } from './app.controller';
import { AppService } from './app.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            shortenUrl: jest.fn(), // Mock function for shortenUrl
            findOriginalUrl: jest.fn(), // Mock function for findOriginalUrl
          },
        },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  describe('urlShorten', () => {
    it('should return the full shortened URL', async () => {
      const mockOriginalUrl = 'https://example.com';
      const mockShortenedId = 'abcd12';
      const mockHost = 'localhost:3000';
      const mockProtocol = 'http';

      jest.spyOn(appService, 'shortenUrl').mockResolvedValue(mockShortenedId);

      const request = {
        body: { url: mockOriginalUrl },
        protocol: mockProtocol,
        get: jest.fn().mockReturnValue(mockHost),
      } as any; // Mock request object

      const result = await appController.urlShorten(request);
      expect(result).toEqual(`${mockProtocol}://${mockHost}/${mockShortenedId}`);
      expect(appService.shortenUrl).toHaveBeenCalledWith(mockOriginalUrl);
    });
  });

  describe('getRedirect', () => {
    it('should redirect to the original URL when found', async () => {
      const mockShortUrl = 'abcd12';
      const mockOriginalUrl = 'https://example.com';

      jest
        .spyOn(appService, 'findOriginalUrl')
        .mockResolvedValue(mockOriginalUrl);

      const mockResponse = {
        redirect: jest.fn(), // Mock the redirect function
      } as unknown as Response;

      await appController.getRedirect(mockShortUrl, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(mockOriginalUrl);
      expect(appService.findOriginalUrl).toHaveBeenCalledWith(mockShortUrl);
    });

    it('should throw a 404 HttpException when the short URL is not found', async () => {
      const mockShortUrl = 'unknown123';

      jest.spyOn(appService, 'findOriginalUrl').mockResolvedValue(null);

      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      await expect(
        appController.getRedirect(mockShortUrl, mockResponse),
      ).rejects.toThrow(new HttpException('Not found', HttpStatus.NOT_FOUND));

      expect(appService.findOriginalUrl).toHaveBeenCalledWith(mockShortUrl);
      expect(mockResponse.redirect).not.toHaveBeenCalled(); // Ensure redirect is not called
    });
  });
});
