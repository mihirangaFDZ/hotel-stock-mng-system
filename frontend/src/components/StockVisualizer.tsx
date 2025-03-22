import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'; // Explicitly import Three.js
import { stockData, StockItem } from '../data/dummyData';

const StockBox: React.FC<{ item: StockItem; index: number }> = ({ item, index }) => {
  return (
    <mesh position={[index * 2 - (stockData.length * 2) / 2, item.quantity / 100, 0]}>
      <boxGeometry args={[1, item.quantity / 50, 1]} />
      <meshStandardMaterial color={item.quantity < item.threshold ? '#ff4444' : '#00f7ff'} />
    </mesh>
  );
};

const StockVisualizer: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {stockData.map((item: StockItem, index: number) => (
          <StockBox key={item.id} item={item} index={index} />
        ))}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default StockVisualizer;