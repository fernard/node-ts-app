import { Document, HookNextFunction, model, Model, Query, Schema } from 'mongoose';

export interface TourSchema extends Document {
    name: string;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    rating: number;
    ratingsAverage: number;
    ratingsQuantity: number;
    price: number;
    discount: number;
    summary: string;
    description: string;
    imageCover: string;
    images: string[];
    createdAt: Date;
    startDates: Date[];
    secretTour: boolean;
}

export class TourSchema {
    private tourSchema: Schema;

    constructor() {
        this.createSchema();
        this.addQueryHooks();
        this.addDocumentHooks();
        this.addVirtualProps();
    }

    public getSchema(): Schema {
        return this.tourSchema;
    }

    private createSchema(): void {
        this.tourSchema = new Schema(
            {
                name: {
                    type: String,
                    required: [true, 'Tour must have its name specified'],
                    unique: true,
                    trim: true,
                    maxlength: [40, 'A tour must have at most 40 characters'],
                    validate: [
                        function(value: string) {
                            return /^[A-Za-z ]+$/.test(value);
                        },
                        'Tour name must consists of alphabetical characters only',
                    ],
                },
                duration: {
                    type: Number,
                    required: [true, 'A tour must have its duration specified'],
                },
                maxGroupSize: {
                    type: Number,
                    required: [true, 'A tour must have its group size specified'],
                },
                difficulty: {
                    type: String,
                    enum: {
                        values: ['easy', 'medium', 'difficult'],
                        message: 'Difficulty must be either: easy, medium or difficult',
                    },
                    required: [true, 'A tour must have its difficulty level specified'],
                },
                rating: {
                    type: Number,
                    default: 4.5,
                    min: [1, 'Rating must be above 1.0'],
                    max: [5, 'Rating must be below 5.0'],
                },
                ratingsAverage: {
                    type: Number,
                    default: 4.5,
                },
                ratingsQuantity: {
                    type: Number,
                    default: 0,
                },
                price: {
                    type: Number,
                    required: [true, 'Tour must have its price specified'],
                },
                discount: {
                    type: Number,
                    min: [0, 'Discount must be a positive integer between 0 and 100'],
                    max: [100, 'Discount must be a positive integer between 0 and 100'],
                },
                summary: {
                    type: String,
                    trim: true,
                    required: [true, 'Tour must have its summary specified'],
                },
                description: {
                    type: String,
                    trim: true,
                },
                imageCover: {
                    type: String,
                    required: [true, 'Tour have its cover image'],
                },
                images: [String],
                createdAt: {
                    type: Date,
                    select: false,
                },
                startDates: [Date],
                secretTour: Boolean,
            },
            {
                toJSON: {
                    virtuals: true,
                },
                toObject: {
                    virtuals: true,
                },
            },
        );
    }

    private addQueryHooks(): void {
        this.tourSchema.pre<Query<TourSchema>>(/^find/, false, function(next: HookNextFunction): void {
            this.find({
                secretTour: {
                    $ne: true,
                },
            });
            next();
        });
    }

    private addDocumentHooks(): void {
        this.tourSchema.pre<TourSchema>('save', function(next: HookNextFunction): void {
            this.createdAt = new Date();
            next();
        });

        this.tourSchema.post<TourSchema>('save', function(document: TourSchema, next: HookNextFunction): void {
            console.log(`NEW TOUR CREATED: ${JSON.stringify(document)}`);
            next();
        });
    }

    private addVirtualProps(): void {
        this.tourSchema.virtual('priceBeforeDiscount').get(function(): number {
            return Math.round(this.price / (1 - this.discount / 100));
        });
    }
}

export const Tour: Model<TourSchema> = model<TourSchema>('Tour', new TourSchema().getSchema());
