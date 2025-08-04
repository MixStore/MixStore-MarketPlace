import { ScrollView } from "react-native";
import ProductDetailComponent from "../../../components/ProductDetailComponent";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function ProductDetailScreen(){
        const {params}=useRoute()
        const navigation =  useNavigation();
        
    
    return(
        <ScrollView showsHorizontalScrollIndicator={false} >
            <ProductDetailComponent params={params} navigation={navigation} />
        </ScrollView>
    )
}
