import { loadDeals } from "../scripts/loadDeals";
import { ContinentSummary, Deal } from "../types";
import path from 'path';
const DATA_FILE = path.resolve(process.cwd(), 'deals.json');

const getValuationFromDeal = (deal: Deal): number => {
    if (deal.price && typeof deal.price == "number") {
        return deal.price;
    }
    if (deal.valuation_usd && typeof deal.valuation_usd == "number") {
        return deal.valuation_usd;
    }
    if (deal.val_usd && typeof deal.val_usd == "number") {
        return deal.val_usd;
    }
    return (deal.price || deal.valuation_usd || deal.val_usd) as number;
}

function GetDateDifference(date: Date, otherDate: Date) {
    var dateOnly = date.setHours(0, 0, 0, 0);
    var otherDateOnly = otherDate.setHours(0, 0, 0, 0);
    var milliseconds = Math.abs(dateOnly - otherDateOnly);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(milliseconds / millisecondsPerDay);
}

class DealService {
    private deals: Deal[] = [];
    private dealMapping = new Map<string, Deal>();

    constructor() {
        this.deals = loadDeals(DATA_FILE);
        for (let i=0;i<this.deals.length;i++) {
            this.dealMapping.set(this.deals[i].deal_id, this.deals[i]);
        }
    }

    getSummary(): ContinentSummary[]{
        let dealsByContinent = new Map<string, number[]>();
        for (let i=0;i<this.deals.length;i++){
            const deal = this.deals[i];
            if (!dealsByContinent.get(deal.continent)) {
                dealsByContinent.set(deal.continent, []);
            }

            const deals = dealsByContinent.get(deal.continent);
            const valuation = getValuationFromDeal(deal);
            deals?.push(valuation);

        }

        let summary: ContinentSummary[] = []

        for (let [key, value] of dealsByContinent) {
            const sortedValues = value.sort();
            const total = sortedValues.length;
            const midIndex = Math.floor(total/2);
            const median_valuation = total%2 === 0 ? 
                (sortedValues[midIndex] + sortedValues[midIndex - 1])/2 : 
                sortedValues[midIndex];

            summary.push({
                total: total,
                continent: key,
                median_valuation: median_valuation
            })
        };

        return summary;
    }

    getDealsById(id: string) {
        const deal =  this.dealMapping.get(id);
        if (!deal || !deal.announced) {
            return false;
        }
        const dateDifference = GetDateDifference(new Date(), new Date(deal.announced));
    
        return {...deal, dateDiffernce: dateDifference };
    }


}

export const dealService = new DealService();