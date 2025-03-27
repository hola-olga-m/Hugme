"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodsService = void 0;
const common_1 = require("@nestjs/common");
const mood_entity_1 = require("./entities/mood.entity");
const users_service_1 = require("../users/users.service");
const postgraphile_service_1 = require("../postgraphile/postgraphile.service");
const friends_service_1 = require("../friends/friends.service");
const uuid_1 = require("uuid");
let MoodsService = class MoodsService {
    postgraphileService;
    usersService;
    friendsService;
    moodsTable = 'moods';
    constructor(postgraphileService, usersService, friendsService) {
        this.postgraphileService = postgraphileService;
        this.usersService = usersService;
        this.friendsService = friendsService;
    }
    async create(createMoodInput, userId) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const moodData = {
            ...createMoodInput,
            userId,
            id: (0, uuid_1.v4)(),
            createdAt: new Date()
        };
        return await this.postgraphileService.insert(this.moodsTable, moodData);
    }
    async findAll() {
        const moods = await this.postgraphileService.findAll(this.moodsTable);
        for (const mood of moods) {
            if (mood.userId) {
                try {
                    mood.user = await this.usersService.findOne(mood.userId);
                }
                catch (error) {
                }
            }
        }
        return moods;
    }
    async findPublic() {
        const moods = await this.postgraphileService.findWhere(this.moodsTable, { isPublic: true });
        for (const mood of moods) {
            if (mood.userId) {
                try {
                    mood.user = await this.usersService.findOne(mood.userId);
                }
                catch (error) {
                }
            }
        }
        return moods;
    }
    async findByUser(userId) {
        const moods = await this.postgraphileService.findWhere(this.moodsTable, { userId });
        const user = await this.usersService.findOne(userId);
        for (const mood of moods) {
            mood.user = user;
        }
        return moods;
    }
    async findOne(id) {
        const mood = await this.postgraphileService.findById(this.moodsTable, id);
        if (!mood) {
            throw new common_1.NotFoundException(`Mood with ID ${id} not found`);
        }
        if (mood.userId) {
            try {
                mood.user = await this.usersService.findOne(mood.userId);
            }
            catch (error) {
            }
        }
        return mood;
    }
    async update(id, updateMoodInput, userId) {
        const mood = await this.findOne(id);
        if (mood.userId !== userId) {
            throw new Error('You do not have permission to update this mood');
        }
        return await this.postgraphileService.update(this.moodsTable, id, updateMoodInput);
    }
    async remove(id, userId) {
        const mood = await this.findOne(id);
        if (mood.userId !== userId) {
            throw new Error('You do not have permission to delete this mood');
        }
        return await this.postgraphileService.delete(this.moodsTable, id);
    }
    async getUserMoodStreak(userId) {
        const moodsQuery = `
      SELECT * FROM ${this.moodsTable}
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
        const { rows: moods } = await this.postgraphileService.query(moodsQuery, [userId]);
        if (moods.length === 0) {
            return 0;
        }
        let streak = 1;
        let currentDate = new Date(moods[0].created_at);
        currentDate.setHours(0, 0, 0, 0);
        for (let i = 1; i < moods.length; i++) {
            const moodDate = new Date(moods[i].created_at);
            moodDate.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(currentDate.getTime() - moodDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
                currentDate = moodDate;
            }
            else if (diffDays > 1) {
                break;
            }
        }
        return streak;
    }
    async convertToMoodEntity(row) {
        const mood = new mood_entity_1.Mood();
        mood.id = row.id;
        mood.score = row.score || row.mood_rating || 0;
        mood.note = row.note || row.mood_description || '';
        mood.isPublic = row.is_public;
        mood.userId = row.user_id;
        mood.createdAt = row.created_at;
        if (row.user_id) {
            try {
                mood.user = await this.usersService.findOne(row.user_id);
            }
            catch (error) {
                mood.user = await this.usersService.findOne(row.user_id);
            }
        }
        return mood;
    }
    async findFriendsMoods(userId, limit = 20) {
        const friendships = await this.friendsService.findFriends(userId);
        if (!friendships || friendships.length === 0) {
            return [];
        }
        const friendIds = friendships.map(friendship => friendship.requesterId === userId ? friendship.recipientId : friendship.requesterId);
        const moodsQuery = `
      SELECT * FROM ${this.moodsTable}
      WHERE user_id = ANY($1) AND is_public = TRUE
      ORDER BY created_at DESC
      LIMIT $2
    `;
        const { rows: friendMoods } = await this.postgraphileService.query(moodsQuery, [friendIds, limit]);
        const moods = [];
        for (const row of friendMoods) {
            moods.push(await this.convertToMoodEntity(row));
        }
        return moods;
    }
};
exports.MoodsService = MoodsService;
exports.MoodsService = MoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService,
        users_service_1.UsersService,
        friends_service_1.FriendsService])
], MoodsService);
//# sourceMappingURL=moods.service.js.map