"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContentLimits {
  maxProjects: number;
  maxEditorials: number;
  maxInstagram: number;
}

export default function ContentLimitsPage() {
  const [limits, setLimits] = useState<ContentLimits>({
    maxProjects: 3,
    maxEditorials: 10,
    maxInstagram: 3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const settings = await response.json();
          setLimits({
            maxProjects: parseInt(settings.maxProjects || '3'),
            maxEditorials: parseInt(settings.maxEditorials || '10'),
            maxInstagram: parseInt(settings.maxInstagram || '3'),
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Error loading settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Save each setting
      const promises = [
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'maxProjects',
            value: limits.maxProjects,
            description: 'Maximum number of projects to show on homepage'
          })
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'maxEditorials',
            value: limits.maxEditorials,
            description: 'Maximum number of editorials to show on homepage'
          })
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'maxInstagram',
            value: limits.maxInstagram,
            description: 'Maximum number of Instagram posts to show on homepage'
          })
        })
      ];

      await Promise.all(promises);
      setMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ContentLimits, value: string) => {
    const numValue = parseInt(value) || 0;
    setLimits(prev => ({ ...prev, [field]: Math.max(0, numValue) }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Limits</h1>
        <p className="text-muted-foreground mt-2">
          Control how many items appear on the homepage
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Homepage Content Limits</CardTitle>
            <CardDescription>
              Set the maximum number of items to display on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maxProjects">Maximum Projects</Label>
              <Input
                id="maxProjects"
                type="number"
                min="0"
                max="20"
                value={limits.maxProjects}
                onChange={(e) => handleInputChange('maxProjects', e.target.value)}
                placeholder="3"
              />
              <p className="text-sm text-muted-foreground">
                Number of projects to show on homepage (0 = show all)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEditorials">Maximum Editorials</Label>
              <Input
                id="maxEditorials"
                type="number"
                min="0"
                max="20"
                value={limits.maxEditorials}
                onChange={(e) => handleInputChange('maxEditorials', e.target.value)}
                placeholder="10"
              />
              <p className="text-sm text-muted-foreground">
                Number of editorials to show on homepage (0 = show all)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxInstagram">Maximum Instagram Posts</Label>
              <Input
                id="maxInstagram"
                type="number"
                min="0"
                max="20"
                value={limits.maxInstagram}
                onChange={(e) => handleInputChange('maxInstagram', e.target.value)}
                placeholder="3"
              />
              <p className="text-sm text-muted-foreground">
                Number of Instagram posts to show on homepage (0 = show all)
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              
              {message && (
                <p className={`mt-2 text-sm ${
                  message.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Limits</CardTitle>
            <CardDescription>
              Preview of current homepage limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{limits.maxProjects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{limits.maxEditorials}</div>
                <div className="text-sm text-muted-foreground">Editorials</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{limits.maxInstagram}</div>
                <div className="text-sm text-muted-foreground">Instagram</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
