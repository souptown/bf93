package com.breakingfree.rest;

import java.io.*;
import java.net.*;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import au.com.bytecode.opencsv.CSVReader;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

//The Java class will be hosted at the URI path "/helloworld"
@Path("/classmates")
public class Classmates {

	@Path("/mostwanted")
	// The Java method will process HTTP GET requests
	@GET
	// The Java method will produce content identified by the MIME Media
	// type "application/json"
	@Produces("application/json")
	// @Produces("text/html")
	public String getMostWanted() {


		StringWriter json = new StringWriter();
		String name;

		try
		{
			URL mostWantedUrl = new URL("https://docs.google.com/a/breakingfree93.com/spreadsheet/pub?key=0AorXvig1X1NfdHV6STZPcWhreU5fTTBaWUIxU1ZVRkE&single=true&gid=0&output=csv");
			URLConnection connection = mostWantedUrl.openConnection();
			// json.write(convertStreamToString(connection.getInputStream()));
			// return json.toString();
			InputStreamReader in = new InputStreamReader(connection.getInputStream());
			CSVReader reader = new CSVReader(in);
			JsonGenerator g = (new JsonFactory()).createJsonGenerator(json);

			// Wrapper object
			g.writeStartObject();
			// Array of people
			g.writeArrayFieldStart("aaData");

			String [] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				// // nextLine[] is an array of values from the line
				// System.out.println(nextLine[0] + nextLine[1] + "etc...");

				name = nextLine[0];
				if (nextLine.length > 1)
				{
					name = name + ", " + nextLine[1];
				}

				// Person
				g.writeStartArray();
				g.writeString(name);
				g.writeEndArray();
			}
			// Array of people
			g.writeEndArray();
			// Wrapper object
			g.writeEndObject();
			g.close();
		}
		catch (IOException ioe)
		{
			json.write("{ error: 'Failed to retrieve most wanted list'}");
		}

		return json.toString();
	}

	String convertStreamToString(java.io.InputStream is) {
		java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
		return s.hasNext() ? s.next() : "";
	}

}
