import { useEffect, useState } from 'react';
import {
    ALargeSmall,
    DraftingCompass,
    FlipVertical2,
    Palette,
    RulerDimensionLine,
    TextInitial,
} from 'lucide-react';
import { Avatar } from './Avatar';
import styles from './App.module.css';
import { useDropZone } from './hooks/useDropZone';
import { loadImageAsBase64 } from './utils/loadImageAsBase64';
import { blobToCanvas } from './hooks/blobToCanvas';
import { cutCanvasToSquare } from './hooks/cutCanvasToSquare';
import { ColorPickerWithAlpha, type ColorWithAlpha } from './components/ColorPickerWithAlpha';
import { handleDownloadAsSVG } from './utils/handleDownloadAsSVG';
import { handleDownloadAsPNG } from './utils/handleDownloadAsPNG';
import { FieldGroup } from './components/FieldGroup';
import { Field } from './components/Field';
import { PageHeader } from './components/PageHeader';
import { FieldValuePreview } from './components/FieldValuePreview';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from './components/Tabs';
import { UserNameHelp } from './components/UserNameHelp';
import { Button } from './components/Button';
import {
    R, DEFAULT_USER_PROFILE_LINK,

    DEFAULT_TEXT_COLOR, DEFAULT_TEXT, DEFAULT_TEXT_FLIP_Y,
    DEFAULT_TEXT_OFFSET_Y, MIN_TEXT_OFFSET_Y, MAX_TEXT_OFFSET_Y,
    DEFAULT_TEXT_FONT_SIZE, MIN_FONT_SIZE, MAX_FONT_SIZE,

    DEFAULT_BORDER_COLOR, DEFAULT_BORDER_THICKNESS,
    MIN_BORDER_THICKNESS, MAX_BORDER_THICKNESS,

    DEFAULT_LABEL_ANGLE, MIN_LABEL_ANGLE, MAX_LABEL_ANGLE,
    DEFAULT_LABEL_COLOR,
    DEFAULT_LABEL_DISTANCE,
} from './settings';

export const App = () => {
    const [ isDefaultUserProfile, setIsDefaultUserProfile ] = useState(true);
    // avatar url
    const [ userProfileLink, setUserProfileLink ] = useState(DEFAULT_USER_PROFILE_LINK);
    const [ username, setUsername ] = useState('');
    const [ userAvatarUrl, setUserAvatarUrl ] = useState('');
    // text
    const [ textColor, setTextColor ] = useState(DEFAULT_TEXT_COLOR);
    const [ text, setText ] = useState(DEFAULT_TEXT);
    const [ flipTextY, setFlipTextY ] = useState(DEFAULT_TEXT_FLIP_Y);
    const [ textOffsetY, setTextOffsetY ] = useState(DEFAULT_TEXT_OFFSET_Y);
    const [ fontSize, setFontSize ] = useState(DEFAULT_TEXT_FONT_SIZE);
    // border
    const [ borderColor, setBorderColor ] = useState<ColorWithAlpha>(DEFAULT_BORDER_COLOR);
    const [ borderThickness, setBorderThickness ] = useState(DEFAULT_BORDER_THICKNESS);
    // label
    const [ labelColor, setLabelColor ] = useState<ColorWithAlpha>(DEFAULT_LABEL_COLOR);
    const [ labelDistance, setLabelDistance ] = useState(DEFAULT_LABEL_DISTANCE);
    const [ labelAngle, setLabelAngle ] = useState(DEFAULT_LABEL_ANGLE);

    const toggleAvatarSource = (isDefaultProfile: boolean) => {
        if (isDefaultProfile) {
            setUserProfileLink(DEFAULT_USER_PROFILE_LINK);
            setUsername(DEFAULT_USER_PROFILE_LINK.replace('@', ''));
        } else {
            setUsername('avatar');
        }
        setIsDefaultUserProfile(isDefaultProfile);
    }

    const handleDrop = async (file: File) => {
        const sourceCanvas = await blobToCanvas(file);
        const squareCanvas = cutCanvasToSquare(sourceCanvas);
        const url = squareCanvas.toDataURL('image/png', 100);
        setUserAvatarUrl(url);
    };
    const { isDraggingOver, ...dropZoneProps } = useDropZone({ onDrop: handleDrop });

    const loadDefaultUserAvatarUrl = async (username: string) => {
        const originalUrl = `https://t.me/i/userpic/320/${username}.jpg`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
        try {
            const url = await loadImageAsBase64(proxyUrl);
            setUserAvatarUrl(url);
        } catch (e) {
            setUserAvatarUrl(originalUrl);
        }
    };

    useEffect(() => {
        const regex = /^(?:(?:https:\/\/)?t\.me\/|@)(.+)$/;
        const match = regex.exec(userProfileLink.trim());

        if (match) {
            const username = match[ 1 ];
            setUsername(username);
        }
    }, [ userProfileLink ]);

    useEffect(() => {
        if (username) {
            loadDefaultUserAvatarUrl(username);
        }
    }, [ username ]);

    return (
        <div className={styles.container}>
            <PageHeader>Telegram avatar border builder</PageHeader>
            <div className={styles.layout}>
                <div className={styles.settingsForm}>
                    <FieldGroup label="User avatar">
                        <TabsRoot
                            defaultValue={isDefaultUserProfile ? '1' : '2'}
                            onValueChange={(value) => toggleAvatarSource(value === '1')}
                        >
                            <TabsList aria-label="Manage your account">
                                <TabsTrigger value="1">
                                    User profile
                                </TabsTrigger>
                                <TabsTrigger value="2">
                                    File
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="1">
                                <UserNameHelp/>
                                <input
                                    type="text"
                                    value={userProfileLink}
                                    title="Paste Telegram profile link or username"
                                    onChange={(e) => setUserProfileLink(e.target.value)}
                                />
                            </TabsContent>
                            <TabsContent value="2">
                                <div
                                    {...dropZoneProps}
                                    className={styles.fileDropArea}
                                >
                                    <div>Drop image here ...</div>
                                </div>
                            </TabsContent>
                        </TabsRoot>
                    </FieldGroup>
                    <FieldGroup label="Text">
                        <Field label="Color" icon={<Palette />}>
                            {/*<FieldValuePreview>*/}
                            {/*    {textColor.color}, {textColor.opacity}%*/}
                            {/*</FieldValuePreview>*/}
                            <ColorPickerWithAlpha
                                color={textColor.color}
                                opacity={textColor.opacity}
                                onChange={setTextColor}
                            />
                        </Field>
                        <Field label="Text" icon={<TextInitial />}>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Field>
                        <Field label="Flip verically" icon={<FlipVertical2 />}>
                            <input
                                type="checkbox"
                                checked={flipTextY}
                                onChange={e => setFlipTextY(e.target.checked)}
                            />
                        </Field>
                        <Field label="Offset from center" icon={<RulerDimensionLine />}>
                            <FieldValuePreview>
                                {textOffsetY}
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={textOffsetY}
                                min={MIN_TEXT_OFFSET_Y}
                                max={MAX_TEXT_OFFSET_Y}
                                step={1}
                                onChange={(e) => setTextOffsetY(parseInt(e.target.value, 10))}
                            />
                        </Field>
                        <Field icon={<ALargeSmall/>} label="Font size">
                            <FieldValuePreview>
                                {fontSize}
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={fontSize}
                                min={MIN_FONT_SIZE}
                                max={MAX_FONT_SIZE}
                                step={1}
                                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup label="Border">
                        <Field label="Color" icon={<Palette />}>
                            {/*<FieldValuePreview>*/}
                            {/*    {borderColor.color}, {borderColor.opacity}%*/}
                            {/*</FieldValuePreview>*/}
                            <ColorPickerWithAlpha
                                color={borderColor.color}
                                opacity={borderColor.opacity}
                                onChange={setBorderColor}
                            />
                        </Field>
                        <Field label="Thickness" icon={<RulerDimensionLine />}>
                            <FieldValuePreview>
                                {borderThickness}
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={borderThickness}
                                min={MIN_BORDER_THICKNESS}
                                max={MAX_BORDER_THICKNESS}
                                step={1}
                                onChange={(e) => setBorderThickness(parseInt(e.target.value, 10))}
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup label="Label">
                        <Field label="Color" icon={<Palette />}>
                            {/*<FieldValuePreview>*/}
                            {/*    {labelColor.color}, {labelColor.opacity}%*/}
                            {/*</FieldValuePreview>*/}
                            <ColorPickerWithAlpha
                                color={labelColor.color}
                                opacity={labelColor.opacity}
                                onChange={setLabelColor}
                            />
                        </Field>
                        <Field label="Angle" icon={<DraftingCompass />}>
                            <FieldValuePreview>
                                {labelAngle}&deg;
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={labelAngle}
                                min={MIN_LABEL_ANGLE}
                                max={MAX_LABEL_ANGLE}
                                step={1}
                                onChange={(e) => setLabelAngle(parseInt(e.target.value, 10))}
                            />
                        </Field>
                        <Field label="Distance from center" icon={<RulerDimensionLine />}>
                            <FieldValuePreview>
                                {labelDistance}
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={labelDistance}
                                min={0}
                                max={R}
                                step={1}
                                onChange={(e) => setLabelDistance(parseInt(e.target.value, 10))}
                            />
                        </Field>
                    </FieldGroup>
                </div>
                <div className={styles.avatarContainer}>
                    {userAvatarUrl && (
                        <Avatar
                            url={userAvatarUrl}
                            text={text}
                            textOffsetY={textOffsetY}
                            fontSize={fontSize}
                            labelColor={labelColor}
                            labelDistance={labelDistance}
                            labelAngle={labelAngle}
                            borderColor={borderColor}
                            borderThickness={borderThickness}
                            textColor={textColor}
                            flipTextY={flipTextY}
                        />
                    )}
                    <div className={styles.downloads}>
                        <Button onClick={() => handleDownloadAsSVG('avatar', username)}>
                            SVG Download
                        </Button>
                        <Button onClick={() => handleDownloadAsPNG('avatar', username)}>
                            PNG Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
