import { MoodsService } from './moods.service';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { Mood } from './entities/mood.entity';
import { Response } from 'express';
export declare class MoodsController {
    private readonly moodsService;
    constructor(moodsService: MoodsService);
    create(createMoodInput: CreateMoodInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findPublic(): Promise<Mood[]>;
    getMoodStreak(req: any): Promise<{
        streak: number;
    }>;
    findUserMoods(req: any): Promise<Mood[]>;
    findOne(id: string, req: any): Promise<Mood>;
    update(id: string, updateMoodInput: UpdateMoodInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
