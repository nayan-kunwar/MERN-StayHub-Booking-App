import { useMutation, useQuery } from 'react-query';
import * as apiClient from "../api-client"
import { useParams } from 'react-router-dom';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useAppContext } from '../contexts/AppContext';

const EditHotel = () => {
    const { hotelId } = useParams();
    //console.log(hotelId)
    const { showToast } = useAppContext();

    const { data: hotel } = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ''), {
        enabled: !!hotelId // If hotelId has a value or truthy, then !!hotelId = true otherwise false
    });
    //console.log(hotel) hotel= {}, return value from fetchMyHotelById(), which i come from backend getMyHotelById() api [ /api/my-hotel/:id ]

    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };
    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
}

export default EditHotel;