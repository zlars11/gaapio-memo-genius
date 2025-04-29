
-- This SQL needs to be run in the Supabase SQL Editor
-- Create function to install required extensions
CREATE OR REPLACE FUNCTION public.install_available_extensions_and_test()
RETURNS text AS $$
BEGIN
    -- Check if pg_cron is available and install it if not already installed
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    END IF;

    -- Check if pg_net is available and install it if not already installed
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
        CREATE EXTENSION IF NOT EXISTS pg_net;
    END IF;

    -- Test if everything is working
    PERFORM cron.schedule('test-extension-job', '0 0 31 2 *', 'SELECT 1'); -- Will never run (Feb 31)
    PERFORM cron.unschedule('test-extension-job');

    RETURN 'Extensions installed and working properly';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a cron job exists
CREATE OR REPLACE FUNCTION public.get_cron_job(job_name text)
RETURNS TABLE (
    jobid bigint,
    schedule text,
    command text,
    nodename text,
    nodeport integer,
    database text,
    username text,
    active boolean,
    jobname text
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM cron.job WHERE jobname = job_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create a cron job
CREATE OR REPLACE FUNCTION public.create_cron_job(job_name text, schedule text, command text)
RETURNS text AS $$
BEGIN
    PERFORM cron.schedule(job_name, schedule, command);
    RETURN 'Cron job created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error creating cron job: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update a cron job
CREATE OR REPLACE FUNCTION public.update_cron_job(job_name text, schedule text, command text)
RETURNS text AS $$
DECLARE
    job_id bigint;
BEGIN
    -- Get the job ID
    SELECT jobid INTO job_id FROM cron.job WHERE jobname = job_name;
    
    IF job_id IS NULL THEN
        RETURN 'Job not found';
    END IF;
    
    -- Unschedule the existing job
    PERFORM cron.unschedule(job_id);
    
    -- Schedule a new job with the same name but updated parameters
    PERFORM cron.schedule(job_name, schedule, command);
    
    RETURN 'Cron job updated successfully';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error updating cron job: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
