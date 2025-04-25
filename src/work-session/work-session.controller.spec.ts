import { Test, TestingModule } from '@nestjs/testing';
import { WorkSessionController } from './work-session.controller';

describe('WorkController', () => {
  let controller: WorkSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSessionController],
    }).compile();

    controller = module.get<WorkSessionController>(WorkSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
