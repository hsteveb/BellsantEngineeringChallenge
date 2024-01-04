import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useGetMachineHealthQuery,
  usePostCalculateMachineHealthMutation, usePostResetMachineHealthMutation,
  usePutMachineHealthMutation
} from '../store/api/machineApi';

export const useMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);
  const { data } = useGetMachineHealthQuery({});
  const [updateMachineData, updateMachineRes] = usePutMachineHealthMutation();
  const [calculateMachineData, calculateMachineDataRes] = usePostCalculateMachineHealthMutation();
  const [resetMachineData, resetMachineDataRes] = usePostResetMachineHealthMutation();

  useEffect(() => {
    // Load machine data from local storage when the hook initializes
    setMachineData(data);
  }, [data]);

  return {
    machineData,
    calculateMachineData,
    updateMachineData,
    resetMachineData,
    calculateMachineDataRes,
    updateMachineRes,
    resetMachineDataRes,
  };
};
