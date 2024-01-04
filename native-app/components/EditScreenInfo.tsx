import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {Button, StyleSheet, TextInput} from 'react-native';
import { get, invert, isEmpty } from 'lodash';

import {Text, View} from './Themed';
import {
  AssemblyLinePart, machineNames,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart
} from '../data/types';
import {useMachineData} from '../app/useMachineData';
import {useFocusEffect} from 'expo-router';
import Picker from './Picker';
import { objectToPairs } from '../utils/object/objectToPairs';

/** TODO: Add onFocusBack on the redux **/
export default function EditScreenInfo({path}: {path: string}) {
  const [machineName, setMachineName] = useState('');
  const [partName, setPartName] = useState('');
  const [partValue, setPartValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const {machineData, updateMachineData, updateMachineRes} = useMachineData();
  const { isLoading, isSuccess } = updateMachineRes;

  // Refactored code to use the machineNames object in types so that less bugs are introduced.
  const machineNameValues = useMemo(() => objectToPairs(invert(machineNames)), []);

  // Refactored code to show the correct parts for each machine instead of being one list.
  const partNames = useMemo(() => ({
    [MachineType.WeldingRobot]: objectToPairs(WeldingRobotPart),
    [MachineType.PaintingStation]: objectToPairs(PaintingStationPart),
    [MachineType.AssemblyLine]: objectToPairs(AssemblyLinePart),
    [MachineType.QualityControlStation]: objectToPairs(QualityControlStationPart),
  }), []);

  // Refactored to support the update hook and also added isEmpty to make sure the object is actually empty.
  const savePart = useCallback(async () => {
    try {
      const newMachineData = !isEmpty(machineData)
        ? JSON.parse(JSON.stringify(machineData))
        : {machines: {}}; // Deep copy machine parts

      if (!newMachineData.machines[machineName]) {
        newMachineData.machines[machineName] = {};
      }

      newMachineData.machines[machineName][partName] = partValue;

      updateMachineData({ body: newMachineData });
    } catch (error) {
      console.error(error);
      throw error; // Handle API errors appropriately
    }
  }, [machineData, updateMachineData, machineName, partName, partValue]);

  // Moved save logic here to wait until the response is successful and not loading.
  useEffect(() => {
    if(!isLoading && isSuccess) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  }, [isLoading, isSuccess]);

  return (
    <View>
      <Text style={styles.label}>Machine Name</Text>
      <Picker
        value={machineName}
        onSetValue={setMachineName}
        items={machineNameValues}
      />

      <Text style={styles.label}>Part Name</Text>
      <Picker value={partName} onSetValue={setPartName} items={get(partNames, machineName, [])} />

      <Text style={styles.label}>Part Value</Text>
      <TextInput
        style={styles.input}
        value={partValue}
        onChangeText={(text) => setPartValue(text)}
        placeholder='Enter part value'
      />

      <Button title='Save' onPress={savePart} />

      {isSaved && <Text style={styles.healthScore}>Saved ✔️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  healthScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
