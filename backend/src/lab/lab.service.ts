import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabItem, LabItemDocument } from 'src/lab-item/schemas/lab-item.schema';
import { Lab, LabDocument } from './schemas/lab.schema';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { ImagekitModule } from 'src/imageKit/imagekit.module';
import { ImagekitService } from 'src/imageKit/imagekit.service';




@Injectable()
export class LabService {
    constructor(
        @InjectModel(Lab.name)
        private labModel: Model<LabDocument>,


        @InjectModel(LabItem.name)
        private labItemModel: Model<LabItemDocument>,

        private readonly imagekitService: ImagekitService,
    ) {}



    // Create Lab Setup

    async create(
        createLabDto: CreateLabDto, file: Express.Multer.File,
    ) {
        const uploadedImage = await this.imagekitService.uploadFile(
        file,
        "/lab",
        );

        const lab = await this.labModel.create({
            ...createLabDto,
            image: uploadedImage.url,
            imageFileId: uploadedImage.fileId,
        });

        return {
            success: true,
            message: "Lab setup created successfully",
            lab,
        }
    }


    // Get All Labs

    async findAll() {
        const labs = await this.labModel.find().populate("labItems").sort({ createdAt: -1 });

        return {
            success: true,
            labs,
        };
    }



    // Get Single Lab
    async findOne(id: string) {
        const lab = await this.labModel.findById(id).populate("labItems");

        if(!lab) {
            throw new NotFoundException("Lab Setup not found");

        }

        return {
            success: true,
            lab,
        }
    }

    // Update Lab

    async update(id: string,
                 updateLabDto: UpdateLabDto,
                 file?: Express.Multer.File,
    ) {
        const updateData: any = {...updateLabDto};

        if (file) {

    const existingLab = await this.labModel.findById(id);

    if (existingLab?.imageFileId) {
        await this.imagekitService.deleteFile(
            existingLab.imageFileId,
        );
    }

    const uploadedImage = await this.imagekitService.uploadFile(
        file,
        "/lab",
    );

    updateData.image = uploadedImage.url;
    updateData.imageFileId = uploadedImage.fileId;
}

        const lab = await this.labModel.findByIdAndUpdate(id, updateData, {new: true});

        if(!lab) {
            throw new NotFoundException("Lab Setup not found");
        }

        return {
            success: true,
            message: "Lab Setup updated successfully",
            lab
        }
    }

    // Delete Lab

    async remove(id: string) {
        const lab = await this.labModel.findById(id);

if (!lab) {
    throw new NotFoundException("Lab Setup not found");
}

if (lab.imageFileId) {
    await this.imagekitService.deleteFile(
        lab.imageFileId,
    );
}

await lab.deleteOne();

return {
    success: true,
    message: "Lab setup deleted successfully",
};
    }


}
