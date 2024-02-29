import React, { useState } from 'react';
import { Select, SelectItem, Input, Textarea, Button } from "@nextui-org/react";
import { updatelist } from '@/lib/anilistqueries';
import { toast } from 'sonner';

const statusOptions = [
    { name: "Watching", value: "CURRENT" },
    { name: "Plan to watch", value: "PLANNING" },
    { name: "Completed", value: "COMPLETED" },
    { name: "Rewatching", value: "REPEATING" },
    { name: "Paused", value: "PAUSED" },
    { name: "Dropped", value: "DROPPED" },
];

function Addtolist({ list, eplength, Handlelist, session, id, setList }) {
    const [status, setStatus] = useState(list?.status || '');
    const [score, setScore] = useState(list?.score || 0);
    const [progress, setProgress] = useState(list?.progress || 0);
    const [startDate, setStartDate] = useState(() => {
        if (list?.startedAt) {
            const { year, month, day } = list.startedAt;
            if (year !== null && month !== null && day !== null) {
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
       }
        return '';
    });
    const [finishDate, setFinishDate] = useState(() => {
        if (list?.completedAt) {
            const { year, month, day } = list.completedAt;
            if (year !== null && month !== null && day !== null) {
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
        }
        return '';
    });
    const [rewatches, setRewatches] = useState(list?.repeat || 0); 
    const [notes, setNotes] = useState(list?.notes || '');

    const extractDateInfo = (dateString) => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return { year, month, day };
    };

    const handleProgressChange = (e) => {
        const newProgress = e.target.value;
        if (newProgress > eplength) {
            toast.error(`Progress cannot exceed the maximum value ${eplength}`);
        } else {
            setProgress(newProgress);
        }
    };

    const handleScoreChange = (e) => {
        const newScore = e.target.value;
        if (newScore > 10) {
            toast.error("Score cannot exceed 10");
        } else {
            setScore(newScore);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const startedAtDateInfo = startDate ? extractDateInfo(startDate) : null;
            const finishAtDateInfo = finishDate ? extractDateInfo(finishDate) : null;

            const response = await fetch("https://graphql.anilist.co/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({
                    query: updatelist,
                    variables: {
                        mediaId: id,
                        progress: progress || 0,
                        status: status || null,
                        score: score || 0,
                        startedAt: startedAtDateInfo || null,
                        completedAt: finishAtDateInfo || null,
                        repeat: rewatches || 0,
                        notes: notes || null,
                    },
                }),
            });
            const { data } = await response.json();
            if (data.SaveMediaListEntry === null) {
                toast.error("Something went wrong");
                return;
            }
            console.log("Saved media list entry", data?.SaveMediaListEntry);
            const savedEntry = data?.SaveMediaListEntry;
            setList(savedEntry);
          
            toast.success("List entry updated");
            Handlelist();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    const deleteList = async () => {
        try {
            const response = await fetch("https://graphql.anilist.co/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({
                    query: `
                    mutation DeleteMediaListEntry($id: Int) {
                        DeleteMediaListEntry(id: $id) {
                          deleted
                        }
                      }
                    `,
                    variables: {
                        id: list?.id,
                    },
                }),
            });
            const { data } = await response.json();
            if (data.DeleteMediaListEntry?.deleted === true) {
                console.log("Deleted media list entry");
                toast.success("List entry deleted");
            setList(null);
                Handlelist();
                return;
            }
            toast.error("Something went wrong");
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }


    // console.log(notes)
    return (
        <div className='md:px-1'>
            <form action="" onSubmit={handleSubmit}>
                <div className='grid sm:grid-cols-3 gap-8 gap-y-7 mb-6'>
                    <Select
                        labelPlacement="outside"
                        label="Status"
                        placeholder="Status"
                        selectedKeys={[status]}
                        onChange={(e) => setStatus(e.target.value)}
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            trigger: "m-0 !min-h-[34px] w-full pr-0",
                            value: "",
                            listbox: "m-0 p-0",
                        }}
                        radius="sm"
                        disallowEmptySelection={true}
                    >
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input
                        key="score"
                        type="number"
                        label="Score"
                        labelPlacement="outside"
                        placeholder="Score"
                        radius="sm"
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            inputWrapper: "m-0 !min-h-[34px] w-full",
                        }}
                        value={score}
                        onChange={handleScoreChange}
                    />
                    <Input
                        key="progress"
                        type="number"
                        label="Progress"
                        labelPlacement="outside"
                        placeholder="Progress"
                        radius="sm"
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            inputWrapper: "m-0 !min-h-[34px] w-full",
                        }}
                        max={eplength}
                        value={progress}
                        onChange={handleProgressChange}
                    />
                    <Input
                        key="startdate"
                        type="date"
                        label="Start Date"
                        labelPlacement="outside"
                        placeholder="Start Date"
                        radius="sm"
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            inputWrapper: "m-0 !min-h-[34px] w-full ",
                        }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        key="finishdate"
                        type="date"
                        label="Finish Date"
                        labelPlacement="outside"
                        placeholder="Finish Date"
                        radius="sm"
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            inputWrapper: "m-0 !min-h-[34px] w-full ",
                        }}
                        value={finishDate}
                        onChange={(e) => setFinishDate(e.target.value)}
                    />
                    <Input
                        key="rewatches"
                        type="number"
                        label="Total Rewatches"
                        labelPlacement="outside"
                        placeholder="Total Rewatches"
                        radius="sm"
                        classNames={{
                            mainWrapper: "p-0 m-0 !h-[34px]",
                            inputWrapper: "m-0 !min-h-[34px] w-full ",
                        }}
                        value={rewatches}
                        onChange={(e) => setRewatches(e.target.value)}
                    />
                </div>
                <Textarea
                    variant="flat"
                    label="Notes"
                    placeholder="Enter Something..."
                    labelPlacement="outside"
                    className="max-w-full"
                    minRows={1}
                    disableAnimation={true}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className='mt-6 mb-4 flex flex-row gap-4 items-end justify-end w-full'>
                    <Button color="danger" radius='md' size="sm" onClick={deleteList} className={`${list && list?.status!==null ? 'flex' : 'hidden'}`}>
                        Delete
                    </Button>
                    <Button className='bg-[#4d148c]' type='submit' radius="md" size="sm" isDisabled={!status ? true : false}>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Addtolist;
