"use client";

import { useRef } from "react";
import * as THREE from "three";
import type { Environment } from "@/data/rig";
import { getVariantsByModule } from "@/data/rig";

interface DrillRigModelProps {
  environment: Environment;
  selectedVariants?: Record<string, string>;
}

/** Простая 3D-модель буровой установки из примитивов (chassis, mast, cabin, engine, hydraulics). */
export function DrillRigModel({ environment, selectedVariants = {} }: DrillRigModelProps) {
  const group = useRef<THREE.Group>(null);

  const isArctic = environment === "arctic";

  // Chassis: standard = базовый цвет, extended = длиннее и темнее
  const chassisVariant = selectedVariants.chassis ?? getVariantsByModule("chassis")[0]?.id ?? "chassis-standard";
  const chassisExtended = chassisVariant === "chassis-extended";
  const chassisColor = isArctic ? "#6b9bc4" : (chassisExtended ? "#a63c0a" : "#c2410c");
  const chassisLength = chassisExtended ? 3.8 : 3.2;

  // Drilling unit (mast): standard / heavy — цвет и высота мачты
  const drillVariant = selectedVariants.drillingUnit ?? getVariantsByModule("drillingUnit")[0]?.id ?? "drill-standard";
  const mastHeavy = drillVariant === "drill-heavy";
  const mastColor = mastHeavy ? "#4b5563" : "#6b7280";
  const mastHeight = mastHeavy ? 2.6 : 2.2;
  const mastTopY = mastHeavy ? 3.15 : 2.75;

  // Cabin: basic / premium — цвет и размер кабины
  const cabinVariant = selectedVariants.cabin ?? getVariantsByModule("cabin")[0]?.id ?? "cabin-basic";
  const cabinPremium = cabinVariant === "cabin-premium";
  const cabinColor = isArctic ? "#8baac9" : (cabinPremium ? "#f97316" : "#ea580c");
  const cabinScale = cabinPremium ? 1.08 : 1;

  const engineColor = "#4b5563";
  const accentColor = "#dc2626";

  return (
    <group ref={group} position={[0, 0, 0]} scale={1}>
      {/* Chassis — рама (длина зависит от варианта) */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[chassisLength, 0.35, 1.6]} />
        <meshStandardMaterial color={chassisColor} metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Колёса/опоры (упрощённо — цилиндры) */}
      <mesh position={[-1, 0.15, -0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1, 0.15, -0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1, 0.15, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1, 0.15, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Mast — буровая мачта (высота зависит от варианта) */}
      <mesh position={[0, 1.5 + mastHeight / 2, 1]} castShadow>
        <boxGeometry args={[0.25, mastHeight, 0.25]} />
        <meshStandardMaterial color={mastColor} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Верх мачты (головка) */}
      <mesh position={[0, mastTopY, 1]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Engine — силовой блок (слева сзади) */}
      <mesh position={[-1.2, 0.65, -0.7]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color={engineColor} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-1.2, 0.9, -0.7]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Hydraulics — блок гидравлики (слева по центру) */}
      <mesh position={[-0.95, 0.55, 0.1]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.95, 0.75, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Cabin — кабина оператора (размер и цвет от варианта) */}
      <group position={[1.15, 1.1, 0.25]} scale={[cabinScale, cabinScale, cabinScale]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 1, 0.85]} />
          <meshStandardMaterial color={cabinColor} metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0.35]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.05]} />
          <meshStandardMaterial color="#7dd3fc" transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
