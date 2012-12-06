package org.breakingfree.rest;

import java.io.*;
import java.net.*;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.ArrayList;

import au.com.bytecode.opencsv.CSVReader;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

//The Java class will be hosted at the URI path "/helloworld"
@Path("/api/classmates")
public class Classmates {

	private static String REGISTERED_CSV_URL = "https://docs.google.com/spreadsheet/pub?key=0AiXyCm-Csq4bdDZyTEp0Y1BLaGhSU0h2ZGpFLTFsVlE&single=true&gid=0&output=csv";
	private static String MISSING_CLASSMATES_CSV_URL = "https://docs.google.com/spreadsheet/pub?key=0AiXyCm-Csq4bdDdsczBsaGRBVVZBTTlqWjVQZmNGcHc&single=true&gid=0&output=csv";

	@GET
	@Produces("application/json")
	@Path("/registered")
	public String getRegistered() {

		String json = getJsonFromCsvUrl(REGISTERED_CSV_URL);
		return json;
	}

	@GET
	@Produces("application/json")
	@Path("/missing")
	public String getMissing() {

		String json = getJsonFromCsvUrl(MISSING_CLASSMATES_CSV_URL);
		return json;
	}

	String getJsonFromCsvUrl(String url)
	{
		String json = null;

		try
		{
			URL urlObject = new URL(url);
			URLConnection connection = urlObject.openConnection();
			InputStreamReader in = new InputStreamReader(connection.getInputStream());
			json = csvToJson(in);
		}
		catch (IOException ioe)
		{
			json = "{ error: 'Failed to retrieve most wanted list'}";
		}

		return json;
	}

	String csvToJson(InputStreamReader in) throws IOException {

		StringWriter json = new StringWriter();
		CSVReader reader = new CSVReader(in);
		JsonGenerator g = (new JsonFactory()).createJsonGenerator(json);
		int i = 0;

		// Get headers
		String [] nextLine = reader.readNext();
		ArrayList headers = new ArrayList();
		for (i = 0; i < nextLine.length; i++)
		{
			headers.add(nextLine[i]);
		}

		// Wrapper object
		g.writeStartObject();

		// Array of objects
		g.writeArrayFieldStart("data");

		while ((nextLine = reader.readNext()) != null) {
			// nextLine[] is an array of values from the line

			g.writeStartObject();
			for (i = 0; i < nextLine.length; i++)
			{
				g.writeStringField((String)headers.get(i), nextLine[i]);
			}
			g.writeEndObject();
		}
		g.writeEndArray();
		// Wrapper object
		g.writeEndObject();
		g.close();

		return json.toString();
	}

	String convertStreamToString(java.io.InputStream is) {
		java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
		return s.hasNext() ? s.next() : "";
	}

}
