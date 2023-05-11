export interface ProuctInfoApi {
    positionId: string,
    x: number,
    y: number,
    z: number,
    productId: string,
    quantity: number
}

export interface Vector3 {
    x: number,
    y: number,
    z: number,
}

export interface ProductInfo {
    positionId: string,
    position: Vector3,
    productId: string,
    closestDifferentPoints: Record<string, PositionDistance>,
    distance?:number
}

export interface PositionDistance {
    position: Vector3,
    distance: number
    positionId?: string,
    productId?:string
}

export interface ProductInfo {
    positionId: string,
    position: Vector3,
    productId: string,
    closestDifferentPoints: Record<string, PositionDistance>
}

export interface PathResult {
    pickingOrder:Record<string, string>[], 
    distance: number
}