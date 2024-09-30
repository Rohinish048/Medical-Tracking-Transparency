import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Minus, Thermometer, Activity, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import HyperText from './magicui/hyper-text'
import NumberTicker from "@/components/magicui/number-ticker";
import BlurFade from './magicui/blur-fade'

// Dummy data for medicines
const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    idealTemp: "15-25°C",
    shelfLife: "36 months",
    dosage: "500-1000mg",
    quantity: 0,
  },
  {
    id: 2,
    name: "Amoxicillin",
    idealTemp: "20-25°C",
    shelfLife: "24 months",
    dosage: "250-500mg",
    quantity: 0,
  },
  {
    id: 3,
    name: "Ibuprofen",
    idealTemp: "20-25°C",
    shelfLife: "36 months",
    dosage: "200-400mg",
    quantity: 0,
  },
  {
    id: 4,
    name: "Aspirin",
    idealTemp: "15-30°C",
    shelfLife: "24 months",
    dosage: "75-300mg",
    quantity: 0,
  },
]

export function MedicineDashboardJsx() {
  const [medicines, setMedicines] = useState(initialMedicines)
  const [loadingState, setLoadingState] = useState({}); // State to track loading

  const fetchMedicineQuantities = async () => {
    const updatedMedicines = [...medicines]; // Clone the current medicines

    await Promise.all(updatedMedicines.map(async (medicine, index) => {
      try {
        const response = await axios.post(
          'https://gateway-api.kalp.studio/v1/contract/kalp/query/yvZCOXuc2Zlpz3KQn8KLb6101k5K3Dco1727003890680/ClientAccountBalance',
          {
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: "9f487977475be2bfc7125b1b50d6a42325196007",
            args: {
              id: medicine.id
            }
          },
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY
            }
          }
        );

        console.log(`Response for ID ${medicine.id}:`, response.data);

        const quantity = Number(response.data.result?.result); // Use optional chaining and convert to number

        updatedMedicines[index] = { ...medicine, quantity: !isNaN(quantity) ? quantity : 0 }; // Default to 0 if NaN
      } catch (error) {
        console.error(`Error fetching data for medicine ID ${medicine.id}:`, error);
        updatedMedicines[index] = { ...medicine, quantity: 0 }; // Default to 0 if there's an error
      }
    }));

    setMedicines(updatedMedicines); // Update state with new quantities
  };

  useEffect(() => {
    fetchMedicineQuantities();
  }, []);

  const handleMint = async (id) => {
    setLoadingState((prevState) => ({ ...prevState, [id]: 'minting' })); // Set loading state for this ID
    try {
      const response = await axios.post(
        'https://gateway-api.kalp.studio/v1/contract/kalp/invoke/yvZCOXuc2Zlpz3KQn8KLb6101k5K3Dco1727003890680/Mint',
        {
          network: "TESTNET",
          blockchain: "KALP",
          walletAddress: "9f487977475be2bfc7125b1b50d6a42325196007",
          args: {
            account: "9f487977475be2bfc7125b1b50d6a42325196007",
            id: id,
            amount: 1 // Minting 1 unit
          }
        },
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY
          }
        }
      );

      console.log('Mint response:', response.data);
      alert(`Mint successful for medicine ID: ${id}`);
      fetchMedicineQuantities(); // Re-fetch quantities after minting
    } catch (error) {
      console.error(`Error minting for medicine ID ${id}:`, error);
      alert(`Minting failed for medicine ID: ${id}. Please try again.`);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, [id]: null })); // Reset loading state for this ID
    }
  };

  const handleBurn = async (id) => {
    setLoadingState((prevState) => ({ ...prevState, [id]: 'burning' })); // Set loading state for this ID
    try {
      const response = await axios.post(
        'https://gateway-api.kalp.studio/v1/contract/kalp/invoke/yvZCOXuc2Zlpz3KQn8KLb6101k5K3Dco1727003890680/Burn',
        {
          network: "TESTNET",
          blockchain: "KALP",
          walletAddress: "9f487977475be2bfc7125b1b50d6a42325196007",
          args: {
            account: "9f487977475be2bfc7125b1b50d6a42325196007",
            id: id,
            amount: 1 // Burning 1 unit
          }
        },
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY
          }
        }
      );

      console.log('Burn response:', response.data);
      alert(`Burn successful for medicine ID: ${id}`);
      fetchMedicineQuantities(); // Re-fetch quantities after burning
    } catch (error) {
      console.error(`Error burning for medicine ID ${id}:`, error);
      alert(`Burning failed for medicine ID: ${id}. Please try again.`);
    } finally {
      setLoadingState((prevState) => ({ ...prevState, [id]: null })); // Reset loading state for this ID
    }
  };

  return (
    <div className="container mx-auto p-6 relative my-8 w-full">
      <div className='flex justify-start'>
        <HyperText className="text-4xl md:text-5xl font-bold text-center mb-12" text={"Medicine Supplies Dashboard"} />
      </div>
      <BlurFade delay={0.25} inView>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-50">
          {medicines.map(medicine => (
            <Card key={medicine.id} className="shadow-lg rounded-md border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{medicine.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Current Stock: <NumberTicker value={medicine.quantity} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Thermometer className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-sm">Ideal Temp: {medicine.idealTemp}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="text-sm">Shelf Life: {medicine.shelfLife}</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-sm">Dosage: {medicine.dosage}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBurn(medicine.id)}
                  disabled={loadingState[medicine.id] === 'burning'}
                >
                  {loadingState[medicine.id] === 'burning' ? "Loading..." : <><Minus className="mr-2 h-4 w-4" /> Burn</>}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMint(medicine.id)}
                  disabled={loadingState[medicine.id] === 'minting'}
                >
                  {loadingState[medicine.id] === 'minting' ? "Loading..." : <><Plus className="mr-2 h-4 w-4" /> Mint</>}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </BlurFade>
    </div>
  )
}
