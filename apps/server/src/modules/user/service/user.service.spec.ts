import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService;
	let model: Model<User>;

	const mockUser = {
		_id: 'mockUserId',
		name: 'Test User',
		email: 'test@example.com',
	};

	const mockUserModel = {
		findById: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
		lean: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getModelToken(User.name),
					useValue: mockUserModel,
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
		model = module.get<Model<User>>(getModelToken(User.name));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findOne', () => {
		it('should return a user when found', async () => {
			mockUserModel.findById.mockReturnValue({
				lean: jest.fn().mockResolvedValue(mockUser),
			});

			const result = await service.findOne({ filter: { id: 'mockUserId' } });

			expect(mockUserModel.findById).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(mockUser);
		});

		it('should throw NotFoundException when user is not found', async () => {
			mockUserModel.findById.mockReturnValue({
				lean: jest.fn().mockResolvedValue(null),
			});

			await expect(service.findOne({ filter: { id: 'nonExistentId' } })).rejects.toThrow(
				NotFoundException,
			);

			expect(mockUserModel.findById).toHaveBeenCalledWith('nonExistentId');
		});
	});

	describe('update', () => {
		it('should update and return the user when found', async () => {
			const updateData = { name: 'Updated Name', email: 'updated@example.com' };
			mockUserModel.findByIdAndUpdate.mockResolvedValue({
				...mockUser,
				name: 'Updated Name',
				email: 'updated@example.com',
			});

			const result = await service.update({
				filter: { id: 'mockUserId' },
				data: updateData,
			});

			expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				{ $set: updateData },
				{ new: true, runValidators: true },
			);
			expect(result.name).toBe('Updated Name');
		});

		it('should throw NotFoundException when user to update is not found', async () => {
			mockUserModel.findByIdAndUpdate.mockResolvedValue(null);
			const updateData = { name: 'Updated Name', email: 'updated@example.com' };

			await expect(
				service.update({
					filter: { id: 'nonExistentId' },
					data: updateData,
				}),
			).rejects.toThrow(NotFoundException);

			expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'nonExistentId',
				{ $set: updateData },
				{ new: true, runValidators: true },
			);
		});
	});

	describe('remove', () => {
		it('should remove and return the user when found', async () => {
			mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

			const result = await service.remove({ filter: { id: 'mockUserId' } });

			expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('mockUserId', {
				new: true,
			});
			expect(result).toEqual(mockUser);
		});

		it('should throw NotFoundException when user to remove is not found', async () => {
			mockUserModel.findByIdAndDelete.mockResolvedValue(null);

			await expect(service.remove({ filter: { id: 'nonExistentId' } })).rejects.toThrow(
				NotFoundException,
			);

			expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('nonExistentId', {
				new: true,
			});
		});
	});
});
