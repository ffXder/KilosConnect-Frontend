// for cloundinary
export interface CloudinaryImage {
    url: string;
    public_id: string;
}

export interface LostAndFound {
    _id: string;
    lostId: string;
    item: string;
    description: string | null;
    areaFound: string;
    date: string;
    itemImage: CloudinaryImage
    status: 'Unclaimed' | 'Claimed';
    claimedBy: string | null;
    claimedAt: string | null;
    claimedImage: CloudinaryImage;
    reportedBy: string;
}

// create
export type NewLostAndFound = Pick<LostAndFound, 'item' | 'description' | 'areaFound' | 'date'>;

// update  only status and claimedBy needed
export type UpdateLostAndFound = Partial<Omit<LostAndFound, '_id' | 'lostId'>>;