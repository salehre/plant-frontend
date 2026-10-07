import type { MaybeRefOrGetter } from 'vue'
import type { HistoryEntry } from '~/stores/history.store'
import type { IdentifyResult, SimilarSpecies } from '~/types/identify.types'
import type { Plant } from '~/types/plant.types'

export type PlantResultVariant = 'identify' | 'history' | 'wishlist'

export interface PlantResultItem {
    id: string
    name: string
    scientificName: string
    image?: string
    slug?: string
    confidence?: number
    meta?: string
    plant?: Plant | null
}

export interface PlantResultOptions {
    showConfidence: boolean
    showMeta: boolean
    confirmable: boolean
    removable: boolean
    showWishlistButton: boolean
    defaultOpenFirst: boolean
}

const PRESETS: Record<PlantResultVariant, PlantResultOptions> = {
    identify: {
        showConfidence: true,
        showMeta: false,
        confirmable: true,
        removable: false,
        showWishlistButton: true,
        defaultOpenFirst: true,
    },
    history: {
        showConfidence: true,
        showMeta: true,
        confirmable: false,
        removable: true,
        showWishlistButton: true,
        defaultOpenFirst: false,
    },
    wishlist: {
        showConfidence: false,
        showMeta: true,
        confirmable: false,
        removable: false,
        showWishlistButton: true,
        defaultOpenFirst: false,
    },
}

export function usePlantResultOptions(
    variant: MaybeRefOrGetter<PlantResultVariant>,
    overrides?: MaybeRefOrGetter<Partial<PlantResultOptions> | undefined>,
) {
    return computed<PlantResultOptions>(() => ({
        ...PRESETS[toValue(variant)],
        ...toValue(overrides),
    }))
}

// ---------- مپرها: هر منبع داده → PlantResultItem

export function fromIdentifyResult(result: IdentifyResult): PlantResultItem {
    return {
        id: result.scientificName,
        name: result.plantName,
        scientificName: result.scientificName,
        image: result.image,
        slug: result.slug,
        confidence: result.confidence,
    }
}

export function fromSimilarSpecies(species: SimilarSpecies): PlantResultItem {
    return {
        id: species.scientificName,
        name: species.name,
        scientificName: species.scientificName,
        image: species.image,
        slug: species.slug,
        confidence: species.confidence,
    }
}

export function fromHistoryEntry(entry: HistoryEntry): PlantResultItem {
    return {
        id: entry.id,
        name: entry.plantName,
        scientificName: entry.scientificName,
        image: entry.image,
        slug: entry.slug,
        confidence: entry.confidence,
        meta: toJalaliDate(new Date(entry.timestamp).toISOString()),
    }
}

export function fromPlant(plant: Plant): PlantResultItem {
    return {
        id: plant.id,
        name: plant.name,
        scientificName: plant.scientificName,
        image: plant.images[0],
        slug: plant.slug,
        meta: plant.category,
        plant,
    }
}