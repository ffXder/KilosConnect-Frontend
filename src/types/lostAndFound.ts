export interface LostAndFound {
    _id: string;
    lostId: string;
    item: string;
    description: string | null;
    areaFound: 'WOD' | 'Cafe' | 'Powerlifting' | 'CrossFit' | 'Mezzanine' | 'Other';
    date: string;
    status: 'Unclaimed' | 'Claimed';
    claimedBy: string | null;
    claimedAt: string | null;
    reportedBy: string;
}

// create
export type NewLostAndFound = Omit<LostAndFound, '_id' | 'lostId' | 'status' | 'claimedBy' | 'claimedAt'>;

// update  only status and claimedBy needed
export type UpdateLostAndFound = Partial<Omit<LostAndFound, '_id' | 'lostId'>>;