import axios from "axios";
import { config } from "../../config";

export class Requester{
    async getProductInfo(productId:string) {
        if (!config.apiKey) {
            throw new Error('Please add api key into config.ts')
        }
        try {
          const { data, status } = await axios.get<any>(
            `https://dev.aux.boxpi.com/case-study/products/${productId}/positions`,
            {
              headers: {
                "x-api-key": config.apiKey,
              },
            }
          );
          console.log(JSON.stringify(data, null, 4));
          console.log("response status is: ", status);
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