'use client';

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

interface AvatarConfig {
    seed: string;
    backgroundColor?: string[];
    accessories?: string[];
    accessoriesProbability?: number;
    clothing?: string[];
    clothingColor?: string[];
    eyebrows?: string[];
    eyes?: string[];
    facialHair?: string[];
    facialHairProbability?: number;
    hairColor?: string[];
    mouth?: string[];
    skin?: string[];
    top?: string[];
}

interface AvatarDisplayProps {
    config: AvatarConfig;
    size?: number;
}

export default function AvatarDisplay({ config, size = 40 }: AvatarDisplayProps) {
    const avatarSvg = useMemo(() => {
        const avatar = createAvatar(avataaars, {
            seed: config.seed,
            backgroundColor: config.backgroundColor,
            accessories: config.accessories,
            accessoriesProbability: config.accessoriesProbability,
            clothing: config.clothing,
            clothingColor: config.clothingColor,
            eyebrows: config.eyebrows,
            eyes: config.eyes,
            facialHair: config.facialHair,
            facialHairProbability: config.facialHairProbability,
            hairColor: config.hairColor,
            mouth: config.mouth,
            skin: config.skin,
            top: config.top,
        });
        return avatar.toString();
    }, [config]);

    return (
        <div
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
    );
}
