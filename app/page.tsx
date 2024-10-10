"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@remotion/player';
import { TextVideo } from '@/components/TextVideo';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash2, MoveUp, MoveDown, Edit, Plus } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';

interface Scene {
  id: string;
  text: string;
  duration: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  transition: 'fade' | 'slide' | 'zoom';
}

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [exporting, setExporting] = useState(false);

  const addScene = useCallback(() => {
    const newScene: Scene = {
      id: Date.now().toString(),
      text: '',
      duration: 60,
      fontSize: 64,
      color: '#000000',
      backgroundColor: '#ffffff',
      transition: 'fade',
    };
    setScenes([...scenes, newScene]);
    setCurrentScene(newScene);
  }, [scenes]);

  const updateScene = useCallback((updatedScene: Scene) => {
    setScenes(scenes.map(scene => scene.id === updatedScene.id ? updatedScene : scene));
    setCurrentScene(updatedScene);
  }, [scenes]);

  const deleteScene = useCallback((id: string) => {
    setScenes(scenes.filter(scene => scene.id !== id));
    if (currentScene?.id === id) {
      setCurrentScene(null);
    }
  }, [scenes, currentScene]);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    const items = Array.from(scenes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScenes(items);
  }, [scenes]);

  const durationInFrames = scenes.reduce((total, scene) => total + scene.duration, 0);

  const mockExport = async () => {
    setExporting(true);
    const totalFrames = durationInFrames;
    for (let i = 0; i <= totalFrames; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      console.log(`Rendering: ${Math.floor((i / totalFrames) * 100)}% complete`);
    }
    setExporting(false);
    return `enhanced-video-${Date.now()}.mp4`;
  };

  const handleExport = async () => {
    try {
      const fileName = await mockExport();
      alert(`Video exported successfully! (Mock file: ${fileName})`);
    } catch (error) {
      console.error('Error exporting video:', error);
      alert('Failed to export video. Check console for details.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Enhanced Remotion Video Editor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Scenes
              <Button onClick={addScene}><Plus className="mr-2" /> Add Scene</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="scenes">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {scenes.map((scene, index) => (
                      <Draggable key={scene.id} draggableId={scene.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-secondary p-2 mb-2 rounded flex justify-between items-center"
                          >
                            <span className="truncate flex-grow">{scene.text || 'Empty scene'}</span>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => setCurrentScene(scene)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteScene(scene.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scene Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {currentScene ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sceneText">Scene Text</Label>
                  <Textarea
                    id="sceneText"
                    value={currentScene.text}
                    onChange={(e) => updateScene({ ...currentScene, text: e.target.value })}
                    placeholder="Enter text for the scene"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sceneDuration">Duration (frames)</Label>
                  <Input
                    id="sceneDuration"
                    type="number"
                    value={currentScene.duration}
                    onChange={(e) => updateScene({ ...currentScene, duration: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sceneFontSize">Font Size</Label>
                  <Slider
                    id="sceneFontSize"
                    min={12}
                    max={120}
                    step={1}
                    value={[currentScene.fontSize]}
                    onValueChange={(value) => updateScene({ ...currentScene, fontSize: value[0] })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <ColorPicker
                    color={currentScene.color}
                    onChange={(color) => updateScene({ ...currentScene, color })}
                  />
                </div>
                <div>
                  <Label>Background Color</Label>
                  <ColorPicker
                    color={currentScene.backgroundColor}
                    onChange={(color) => updateScene({ ...currentScene, backgroundColor })}
                  />
                </div>
                <div>
                  <Label htmlFor="sceneTransition">Transition</Label>
                  <Select
                    value={currentScene.transition}
                    onValueChange={(value: 'fade' | 'slide' | 'zoom') => updateScene({ ...currentScene, transition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a transition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Select a scene to edit or create a new one
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {scenes.length > 0 ? (
              <Player
                component={TextVideo}
                inputProps={{ scenes }}
                durationInFrames={durationInFrames}
                compositionWidth={1280}
                compositionHeight={720}
                fps={30}
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                }}
                controls
              />
            ) : (
              <div className="flex items-center justify-center h-[320px] bg-secondary text-secondary-foreground rounded">
                Add scenes to preview the video
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleExport} disabled={scenes.length === 0 || exporting} size="lg">
          {exporting ? 'Exporting...' : 'Export Video'}
        </Button>
      </div>
    </div>
  );
}