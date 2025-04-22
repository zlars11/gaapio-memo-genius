
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Note type matches the database columns
type Note = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

function NoteForm({ onCreate }: { onCreate: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Insert new note
    const { error } = await supabase
      .from("notes")
      .insert({ title, content });
    if (!error) {
      setTitle("");
      setContent("");
      onCreate();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Start writing your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
      <Button type="submit">Add Note</Button>
    </form>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    setNotes(data || []);
    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
    // Cleanup listener on unmount
    return () => {};
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-28 pb-16 container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteForm onCreate={fetchNotes} />
              {loading ? (
                <div className="text-center text-muted-foreground">Loading notes...</div>
              ) : notes.length === 0 ? (
                <div className="text-center text-muted-foreground">You have no notes yet.</div>
              ) : (
                <ul className="space-y-4 w-full">
                  {notes.map((note) => (
                    <li key={note.id} className="border rounded p-4 w-full flex flex-col">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{note.title}</span>
                        <Button size="sm" variant="outline" onClick={() => deleteNote(note.id)}>
                          Delete
                        </Button>
                      </div>
                      <div className="text-muted-foreground whitespace-pre-line">{note.content}</div>
                      <span className="mt-2 text-xs text-muted-foreground">
                        {new Date(note.updated_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
