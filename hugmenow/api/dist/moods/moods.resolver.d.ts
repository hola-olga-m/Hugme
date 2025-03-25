import { MoodsService } from './moods.service';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { User } from '../users/entities/user.entity';
export declare class MoodsResolver {
    private moodsService;
    constructor(moodsService: MoodsService);
    createMood(createMoodInput: CreateMoodInput, user: User): Promise<Mood>;
    publicMoods(): Promise<Mood[]>;
    userMoods(user: User): Promise<Mood[]>;
    mood(id: string): Promise<Mood>;
    moodStreak(user: User): Promise<number>;
    updateMood(updateMoodInput: UpdateMoodInput, user: User): Promise<Mood>;
    removeMood(id: string, user: User): Promise<boolean>;
}
