import { useEffect, useState } from 'react';
// import { ALargeSmall } from 'lucide-react';
import { Avatar, R } from './Avatar';
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

const MIN_ANGLE = 0;
const MAX_ANGLE = 360;
const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 50;
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 100;
const MIN_TEXT_OFFSET_Y = 0;
const MAX_TEXT_OFFSET_Y = 200;

export const App = () => {
    const [ isDefaultUserProfile, setIsDefaultUserProfile ] = useState(true);
    // avatar url
    const [ userProfileLink, setUserProfileLink ] = useState('@durov');
    const [ username, setUsername ] = useState('');
    const [ userAvatarUrl, setUserAvatarUrl ] = useState('');
    // text
    const [ textColor, setTextColor ] = useState<ColorWithAlpha>({ color: '#ffffff', opacity: 100 });
    const [ text, setText ] = useState('GD');
    const [ flipTextY, setFlipTextY ] = useState(false);
    const [ textOffsetY, setTextOffsetY ] = useState(40);
    const [ fontSize, setFontSize ] = useState(48);
    // border
    const [ borderColor, setBorderColor ] = useState<ColorWithAlpha>({ color: '#ff0000', opacity: 100 });
    const [ borderWidth, setBorderWidth ] = useState(12);
    // label
    const [ labelColor, setLabelColor ] = useState<ColorWithAlpha>({ color: '#ff0000', opacity: 100 });
    const [ labelDistance, setLabelDistance ] = useState(80);
    const [ labelAngle, setLabelAngle ] = useState(108);

    const toggleAvatarSource = (isDefaultProfile: boolean) => {
        if (isDefaultProfile) {
            setUsername('durov');
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
                        <Field label="Color">
                            <FieldValuePreview>
                                {textColor.color}, {textColor.opacity}%
                            </FieldValuePreview>
                            <ColorPickerWithAlpha
                                color={textColor.color}
                                opacity={textColor.opacity}
                                onChange={setTextColor}
                            />
                        </Field>
                        <Field label="Text">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Field>
                        <Field label="Flip verically">
                            <input
                                type="checkbox"
                                checked={flipTextY}
                                onChange={e => setFlipTextY(e.target.checked)}
                            />
                        </Field>
                        <Field label="Offset from center">
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
                        <Field label={<>
                            {/*<ALargeSmall/>*/}
                            Font size
                        </>}>
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
                        <Field label="Color">
                            <FieldValuePreview>
                                {borderColor.color}, {borderColor.opacity}%
                            </FieldValuePreview>
                            <ColorPickerWithAlpha
                                color={borderColor.color}
                                opacity={borderColor.opacity}
                                onChange={setBorderColor}
                            />
                        </Field>
                        <Field label="Width">
                            <FieldValuePreview>
                                {borderWidth}
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={borderWidth}
                                min={MIN_BORDER_WIDTH}
                                max={MAX_BORDER_WIDTH}
                                step={1}
                                onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup label="Label">
                        <Field label="Color">
                            <FieldValuePreview>
                                {labelColor.color}, {labelColor.opacity}%
                            </FieldValuePreview>
                            <ColorPickerWithAlpha
                                color={labelColor.color}
                                opacity={labelColor.opacity}
                                onChange={setLabelColor}
                            />
                        </Field>
                        <Field label="Angle">
                            <FieldValuePreview>
                                {labelAngle}&deg;
                            </FieldValuePreview>
                            <input
                                type="range"
                                value={labelAngle}
                                min={MIN_ANGLE}
                                max={MAX_ANGLE}
                                step={1}
                                onChange={(e) => setLabelAngle(parseInt(e.target.value, 10))}
                            />
                        </Field>
                        <Field label="Distance from center">
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
                            borderWidth={borderWidth}
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
