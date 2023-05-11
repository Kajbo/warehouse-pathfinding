import axios from "axios";
import { config } from "../../config";
import { ProuctInfoApi } from "..";

export class Requester{
    async getProductInfo(productId:string) {
        if (!config.apiKey) {
            throw new Error('Please add api key into config.ts')
        }
        try {
          const { data, status } = await axios.get<ProuctInfoApi[]>(
            `https://dev.aux.boxpi.com/case-study/products/${productId}/positions`,
            {
              headers: {
                "x-api-key": config.apiKey,
              },
            }
          );
          
          return data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
          } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
          }
        }
      }
    
}