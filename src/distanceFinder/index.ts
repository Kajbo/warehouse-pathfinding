import { PathResult, PositionDistance, ProductInfo, Requester, Vector3 } from ".."


export class PathFinder {
    requester = new Requester()
    productsPositionsDict:Record<string, ProductInfo[]> = {}
    notCollectedProducts!:string[]
    
    public async findPath(productIds:string[]):Promise<PathResult>{
        this.notCollectedProducts = [...productIds]
        await this.loadProductPositions(productIds)
        
        const lengths = Object.values(this.productsPositionsDict).map((productInfos)=> {
            return {
                productId: productInfos[0].productId,
                length: productInfos.length
            }
        })
        const shortest = lengths.reduce((prev, curr) => prev.length < curr.length ? prev : curr).productId;
        
        this.productsPositionsDict[shortest].forEach((productInfo)=> {
            this.setClosestDifferentPoints(productInfo)
        })
        
        const productSmallestRadius = this.getSmallestRadius()
        
        const findPathBetweenArr = [
            {
                ...productSmallestRadius,
                distance: 0
            },
            ...Object.values(productSmallestRadius.closestDifferentPoints)
        ]
        
        return this.findPathBetweenPoints(findPathBetweenArr)
    }
    
    private findPathBetweenPoints(inputArr:PositionDistance[]):PathResult {
        let notUsedProducts = [...inputArr]
        let lastUsedPosition: Vector3
        const result:PathResult = {
            pickingOrder: [],
            distance: 0
        }
        
        // heuristicky si vezmeme najprv bod ktory je najdalej, potom ideme po bode ktory je najblizsie k nemu
        const firstElem = notUsedProducts.reduce((prev, curr) => prev.distance > curr.distance ? prev : curr);
        lastUsedPosition = firstElem.position
        result.pickingOrder.push({
            productId: firstElem.productId ?? "",
            positionId: firstElem.positionId ?? ""
        })
        notUsedProducts = notUsedProducts.filter(e => e.productId !== firstElem.productId)
        
        while(notUsedProducts.length) {
            for (let i = 0; i < notUsedProducts.length; i++) {
                notUsedProducts[i].distance = this.getDistanceBetween(notUsedProducts[i].position, lastUsedPosition)
            }
            const shortest = notUsedProducts.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr)
            notUsedProducts = notUsedProducts.filter(e => e.productId !== shortest.productId)
            lastUsedPosition = shortest.position
            result.pickingOrder.push({productId: shortest.productId ?? "", positionId: shortest.positionId ?? ""})
            result.distance += shortest.distance
        }
        
        return result
        
    }
    
    private async loadProductPositions(productIds:string[]):Promise<void> {
        
        for (let i = 0; i < productIds.length; i++) {
            const detailInfo = await this.requester.getProductInfo(productIds[i])
            
            if (typeof detailInfo === 'string') {
                console.error(detailInfo)
                return
            }
            
            detailInfo.forEach(pDetail => {
                if (!this.productsPositionsDict[pDetail.productId]) {
                    this.productsPositionsDict[pDetail.productId] = []
                }
                this.productsPositionsDict[pDetail.productId].push({
                    position: {x: pDetail.x, y: pDetail.y, z: pDetail.z},
                    productId: pDetail.productId,
                    positionId: pDetail.positionId,
                    closestDifferentPoints: {}
                })
            });
        }
        
    }
    
    private getDistanceBetween(pointA:Vector3, pointB:Vector3):number {
        return Math.sqrt(
            Math.pow(pointB.x - pointA.x, 2) +
            Math.pow(pointB.y - pointA.y, 2) +
            Math.pow(pointB.z - pointA.z, 2)
        )
    }
    
    private setClosestDifferentPoints(centreProduct:ProductInfo):void {
        const pIds = Object.keys(this.productsPositionsDict)
        for (let i = 0; i < pIds.length; i++) {
            const actualItem = this.productsPositionsDict[pIds[i]]
            if (pIds[i] !== centreProduct.productId) {
                
                for (let j = 0; j < actualItem.length; j++) {
                    const actualSmallest = centreProduct.closestDifferentPoints[pIds[i]]
                    const distance = this.getDistanceBetween(centreProduct.position, actualItem[j].position)
                    if (!actualSmallest || actualSmallest.distance < distance) {
                        centreProduct.closestDifferentPoints[pIds[i]] = {
                            distance,
                            position: actualItem[j].position,
                            positionId: actualItem[j].positionId,
                            productId: actualItem[j].productId
                        }
                    }
                }
                
            }
        }
    }
    
    private getSmallestRadius():ProductInfo {
        let smallest = {distance: Infinity, productId: '', positionId: '', position: {x: 0, y: 0, z:0}, closestDifferentPoints: {}};
        
        Object.values(this.productsPositionsDict).forEach((productInfoArr) => {
            productInfoArr.forEach((productInfo)=> {
                const radius = Math.max(...Object.values(productInfo.closestDifferentPoints).map((positionDistance)=> positionDistance.distance))
                if (radius !== -Infinity) {
                    if (!smallest || radius < smallest.distance) {
                        smallest = {
                            ...productInfo,
                            distance: radius
                        }
                    }
                }
            })
            
        })
        
        return smallest
    }
    
}